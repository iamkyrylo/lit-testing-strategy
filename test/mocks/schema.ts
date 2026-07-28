import { model, schema, collection, factory, relations } from "miragejs-orm";
import { faker } from "@faker-js/faker";
import type { BelongsTo, CollectionConfig, Factory, HasMany, SchemaInstance } from "miragejs-orm";
import type { Product, Sale } from "../../app/types";

export const productModel = model().name("product").collection("products").attrs<Product>().build();

export const saleModel = model().name("sale").collection("sales").attrs<Sale>().build();

const productFactory = factory<TestCollections>()
  .model(productModel)
  .attrs({
    category: () => faker.commerce.department(),
    description: () => faker.commerce.productDescription(),
    imageUrl: () => faker.image.urlPicsumPhotos(),
    name: () => faker.commerce.productName(),
    price: () => Number(faker.commerce.price({ min: 5, max: 500 })),
    sku: () => faker.string.alphanumeric(8).toUpperCase(),
    status: () => faker.helpers.arrayElement(["active", "archived"]),
    stockQuantity: () => faker.number.int({ min: 0, max: 200 }),
  })
  .traits({
    withSales: {
      afterCreate(product, schema) {
        const salesCount = faker.number.int({ min: 1, max: 5 });
        schema.sales.createMany(salesCount, { productId: product.id });
      },
    },
    withManySales: {
      afterCreate(product, schema) {
        const salesCount = faker.number.int({ min: 10, max: 30 });
        schema.sales.createMany(salesCount, { productId: product.id });
      },
    },
  })
  .build();

const saleFactory = factory<TestCollections>()
  .model(saleModel)
  .attrs({
    date: () => faker.date.recent({ days: 60 }).toISOString(),
    unitsSold: () => faker.number.int({ min: 0, max: 100 }),
  })
  .build();

export const testSchema: SchemaInstance<TestCollections> = schema()
  .collections({
    products: collection<TestCollections>()
      .model(productModel)
      .factory(productFactory)
      .relationships({
        sales: relations.hasMany(saleModel),
      })
      .seeds((schema) => {
        schema.products.createMany(20, "withManySales");
      })
      .build(),

    sales: collection<TestCollections>()
      .model(saleModel)
      .factory(saleFactory)
      .relationships({
        product: relations.belongsTo(productModel),
      })
      .build(),
  })
  .build();

/** --- Types --- */

export type ProductModel = typeof productModel;

export type SaleModel = typeof saleModel;

export type TestCollections = {
  products: CollectionConfig<
    ProductModel,
    { sales: HasMany<SaleModel> },
    Factory<ProductModel, "withSales" | "withManySales", TestCollections>,
    TestCollections
  >;
  sales: CollectionConfig<
    SaleModel,
    { product: BelongsTo<ProductModel> },
    Factory<SaleModel, string, TestCollections>,
    TestCollections
  >;
};
