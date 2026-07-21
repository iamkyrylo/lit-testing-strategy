import { model, schema, collection, factory, relations } from "miragejs-orm";
import type { BelongsTo, CollectionConfig, Factory, SchemaInstance } from "miragejs-orm";
import { faker } from "@faker-js/faker";
import type { Product, Sale } from "../../app/types";

export const productModel = model()
  .name("product")
  .collection("products")
  .attrs<Product>()
  .build();

export const saleModel = model().name("sale").collection("sales").attrs<Sale>().build();

type ProductModel = typeof productModel;
type SaleModel = typeof saleModel;

type TestCollections = {
  products: CollectionConfig<
    ProductModel,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- {} is the library's own default for "no relationships"
    {},
    Factory<ProductModel, string, TestCollections>,
    TestCollections
  >;
  sales: CollectionConfig<
    SaleModel,
    { product: BelongsTo<ProductModel, "productId"> },
    Factory<SaleModel, string, TestCollections>,
    TestCollections
  >;
};

const productFactory = factory<TestCollections>()
  .model(productModel)
  .attrs({
    name: () => faker.commerce.productName(),
    sku: () => faker.string.alphanumeric(8).toUpperCase(),
    price: () => Number(faker.commerce.price({ min: 5, max: 500 })),
    stockQuantity: () => faker.number.int({ min: 0, max: 200 }),
    category: () => faker.commerce.department(),
    imageUrl: () => faker.image.urlPicsumPhotos(),
    description: () => faker.commerce.productDescription(),
    status: () => faker.helpers.arrayElement(["active", "archived"]),
  })
  .afterCreate((product, schema) => {
    const salesCount = faker.number.int({ min: 10, max: 30 });
    schema.sales.createMany(salesCount, { productId: product.id });
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
      .seeds((schema) => {
        schema.products.createMany(faker.number.int({ min: 8, max: 16 }));
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
