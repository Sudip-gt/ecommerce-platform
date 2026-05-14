import { MedusaContainer } from "@medusajs/framework";
import {
    ContainerRegistrationKeys,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

type CatalogCategory = {
    id: string;
    name: string;
};

type CatalogProduct = {
    title: string;
    categoryName: string;
    description: string;
    handle: string;
    weight: number;
    images: string[];
    options: Array<{
        title: string;
        values: string[];
    }>;
    variants: Array<{
        title: string;
        sku: string;
        options: Record<string, string>;
        prices: Array<{
            amount: number;
            currency_code: string;
        }>;
    }>;
};

const extraCategories = ["Accessories", "Outerwear"];

const extraProducts: CatalogProduct[] = [
    {
        title: "Medusa Coffee Mug",
        categoryName: "Accessories",
        description:
            "A clean ceramic mug for desk-side coffee breaks and showroom moments.",
        handle: "coffee-mug",
        weight: 400,
        images: [
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png",
        ],
        options: [
            {
                title: "Size",
                values: ["One Size"],
            },
        ],
        variants: [
            {
                title: "One Size",
                sku: "MUG-ONE-SIZE",
                options: {
                    Size: "One Size",
                },
                prices: [
                    {
                        amount: 1000,
                        currency_code: "npr",
                    },
                    {
                        amount: 12,
                        currency_code: "usd",
                    },
                ],
            },
        ],
    },
    {
        title: "Medusa Hoodie",
        categoryName: "Outerwear",
        description:
            "A relaxed heavyweight hoodie made for colder days and layered fits.",
        handle: "hoodie",
        weight: 550,
        images: [
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
        ],
        options: [
            {
                title: "Size",
                values: ["S", "M", "L", "XL"],
            },
        ],
        variants: [
            {
                title: "S",
                sku: "HOODIE-S",
                options: {
                    Size: "S",
                },
                prices: [
                    {
                        amount: 2950,
                        currency_code: "npr",
                    },
                    {
                        amount: 33,
                        currency_code: "usd",
                    },
                ],
            },
            {
                title: "M",
                sku: "HOODIE-M",
                options: {
                    Size: "M",
                },
                prices: [
                    {
                        amount: 2950,
                        currency_code: "npr",
                    },
                    {
                        amount: 33,
                        currency_code: "usd",
                    },
                ],
            },
            {
                title: "L",
                sku: "HOODIE-L",
                options: {
                    Size: "L",
                },
                prices: [
                    {
                        amount: 2950,
                        currency_code: "npr",
                    },
                    {
                        amount: 33,
                        currency_code: "usd",
                    },
                ],
            },
            {
                title: "XL",
                sku: "HOODIE-XL",
                options: {
                    Size: "XL",
                },
                prices: [
                    {
                        amount: 2950,
                        currency_code: "npr",
                    },
                    {
                        amount: 33,
                        currency_code: "usd",
                    },
                ],
            },
        ],
    },
];

export default async function seed_more_catalog({
    container,
}: {
    container: MedusaContainer;
}) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Seeding extra catalog data...");

    const { data: shippingProfiles = [] } = await query.graph({
        entity: "shipping_profile",
        fields: ["id"],
    });

    const shippingProfileId = (shippingProfiles as Array<{ id: string }>)[0]?.id;

    const { data: salesChannels = [] } = await query.graph({
        entity: "sales_channel",
        fields: ["id"],
    });

    const salesChannelId = (salesChannels as Array<{ id: string }>)[0]?.id;

    if (!shippingProfileId || !salesChannelId) {
        throw new Error("Missing shipping profile or sales channel for catalog seed");
    }

    const { data: categoryData = [] } = await query.graph({
        entity: "product_category",
        fields: ["id", "name"],
    });

    const categoryMap = new Map<string, CatalogCategory>(
        (categoryData as CatalogCategory[]).map((category) => [category.name, category])
    );

    const missingCategories = extraCategories.filter((name) => !categoryMap.has(name));

    if (missingCategories.length > 0) {
        const { result: createdCategories } = await createProductCategoriesWorkflow(
            container
        ).run({
            input: {
                product_categories: missingCategories.map((name) => ({
                    name,
                    is_active: true,
                })),
            },
        });

        for (const category of createdCategories) {
            categoryMap.set(category.name, category);
        }
    }

    const { data: productData = [] } = await query.graph({
        entity: "product",
        fields: ["id", "handle"],
    });

    const existingProductHandles = new Set(
        (productData as Array<{ id: string; handle: string }>).map((product) => product.handle)
    );

    const productsToCreate = extraProducts.filter(
        (product) => !existingProductHandles.has(product.handle)
    );

    if (productsToCreate.length > 0) {
        await createProductsWorkflow(container).run({
            input: {
                products: productsToCreate.map((product) => ({
                    title: product.title,
                    category_ids: [categoryMap.get(product.categoryName)!.id],
                    description: product.description,
                    handle: product.handle,
                    weight: product.weight,
                    status: ProductStatus.PUBLISHED,
                    shipping_profile_id: shippingProfileId,
                    images: product.images.map((url) => ({ url })),
                    options: product.options,
                    variants: product.variants,
                    sales_channels: [
                        {
                            id: salesChannelId,
                        },
                    ],
                })),
            },
        });
    }

    logger.info("Finished seeding extra catalog data.");
}