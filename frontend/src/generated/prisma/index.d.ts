
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model MerchantProfile
 * 
 */
export type MerchantProfile = $Result.DefaultSelection<Prisma.$MerchantProfilePayload>
/**
 * Model Brand
 * 
 */
export type Brand = $Result.DefaultSelection<Prisma.$BrandPayload>
/**
 * Model BrandCategory
 * 
 */
export type BrandCategory = $Result.DefaultSelection<Prisma.$BrandCategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model Sale
 * 
 */
export type Sale = $Result.DefaultSelection<Prisma.$SalePayload>
/**
 * Model ProductVariant
 * 
 */
export type ProductVariant = $Result.DefaultSelection<Prisma.$ProductVariantPayload>
/**
 * Model Feature
 * 
 */
export type Feature = $Result.DefaultSelection<Prisma.$FeaturePayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model Mockup
 * 
 */
export type Mockup = $Result.DefaultSelection<Prisma.$MockupPayload>
/**
 * Model MockupVariant
 * 
 */
export type MockupVariant = $Result.DefaultSelection<Prisma.$MockupVariantPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FitType: {
  MEN: 'MEN',
  WOMEN: 'WOMEN',
  YOUTH: 'YOUTH'
};

export type FitType = (typeof FitType)[keyof typeof FitType]


export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  BRAND: 'BRAND',
  MERCH: 'MERCH'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Visibility: {
  SEARCHABLE: 'SEARCHABLE',
  NON_SEARCHABLE: 'NON_SEARCHABLE'
};

export type Visibility = (typeof Visibility)[keyof typeof Visibility]


export const ImageType: {
  FRONT: 'FRONT',
  BACK: 'BACK'
};

export type ImageType = (typeof ImageType)[keyof typeof ImageType]

}

export type FitType = $Enums.FitType

export const FitType: typeof $Enums.FitType

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Visibility = $Enums.Visibility

export const Visibility: typeof $Enums.Visibility

export type ImageType = $Enums.ImageType

export const ImageType: typeof $Enums.ImageType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.merchantProfile`: Exposes CRUD operations for the **MerchantProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MerchantProfiles
    * const merchantProfiles = await prisma.merchantProfile.findMany()
    * ```
    */
  get merchantProfile(): Prisma.MerchantProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.brand`: Exposes CRUD operations for the **Brand** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Brands
    * const brands = await prisma.brand.findMany()
    * ```
    */
  get brand(): Prisma.BrandDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.brandCategory`: Exposes CRUD operations for the **BrandCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BrandCategories
    * const brandCategories = await prisma.brandCategory.findMany()
    * ```
    */
  get brandCategory(): Prisma.BrandCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sale`: Exposes CRUD operations for the **Sale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sales
    * const sales = await prisma.sale.findMany()
    * ```
    */
  get sale(): Prisma.SaleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productVariant`: Exposes CRUD operations for the **ProductVariant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductVariants
    * const productVariants = await prisma.productVariant.findMany()
    * ```
    */
  get productVariant(): Prisma.ProductVariantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feature`: Exposes CRUD operations for the **Feature** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Features
    * const features = await prisma.feature.findMany()
    * ```
    */
  get feature(): Prisma.FeatureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mockup`: Exposes CRUD operations for the **Mockup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mockups
    * const mockups = await prisma.mockup.findMany()
    * ```
    */
  get mockup(): Prisma.MockupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mockupVariant`: Exposes CRUD operations for the **MockupVariant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MockupVariants
    * const mockupVariants = await prisma.mockupVariant.findMany()
    * ```
    */
  get mockupVariant(): Prisma.MockupVariantDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    MerchantProfile: 'MerchantProfile',
    Brand: 'Brand',
    BrandCategory: 'BrandCategory',
    Product: 'Product',
    Sale: 'Sale',
    ProductVariant: 'ProductVariant',
    Feature: 'Feature',
    Tag: 'Tag',
    Mockup: 'Mockup',
    MockupVariant: 'MockupVariant'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "merchantProfile" | "brand" | "brandCategory" | "product" | "sale" | "productVariant" | "feature" | "tag" | "mockup" | "mockupVariant"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      MerchantProfile: {
        payload: Prisma.$MerchantProfilePayload<ExtArgs>
        fields: Prisma.MerchantProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchantProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchantProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          findFirst: {
            args: Prisma.MerchantProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchantProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          findMany: {
            args: Prisma.MerchantProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>[]
          }
          create: {
            args: Prisma.MerchantProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          createMany: {
            args: Prisma.MerchantProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchantProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>[]
          }
          delete: {
            args: Prisma.MerchantProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          update: {
            args: Prisma.MerchantProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          deleteMany: {
            args: Prisma.MerchantProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchantProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MerchantProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>[]
          }
          upsert: {
            args: Prisma.MerchantProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantProfilePayload>
          }
          aggregate: {
            args: Prisma.MerchantProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchantProfile>
          }
          groupBy: {
            args: Prisma.MerchantProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchantProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchantProfileCountArgs<ExtArgs>
            result: $Utils.Optional<MerchantProfileCountAggregateOutputType> | number
          }
        }
      }
      Brand: {
        payload: Prisma.$BrandPayload<ExtArgs>
        fields: Prisma.BrandFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BrandFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BrandFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          findFirst: {
            args: Prisma.BrandFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BrandFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          findMany: {
            args: Prisma.BrandFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>[]
          }
          create: {
            args: Prisma.BrandCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          createMany: {
            args: Prisma.BrandCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BrandCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>[]
          }
          delete: {
            args: Prisma.BrandDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          update: {
            args: Prisma.BrandUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          deleteMany: {
            args: Prisma.BrandDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BrandUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BrandUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>[]
          }
          upsert: {
            args: Prisma.BrandUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          aggregate: {
            args: Prisma.BrandAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBrand>
          }
          groupBy: {
            args: Prisma.BrandGroupByArgs<ExtArgs>
            result: $Utils.Optional<BrandGroupByOutputType>[]
          }
          count: {
            args: Prisma.BrandCountArgs<ExtArgs>
            result: $Utils.Optional<BrandCountAggregateOutputType> | number
          }
        }
      }
      BrandCategory: {
        payload: Prisma.$BrandCategoryPayload<ExtArgs>
        fields: Prisma.BrandCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BrandCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BrandCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          findFirst: {
            args: Prisma.BrandCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BrandCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          findMany: {
            args: Prisma.BrandCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>[]
          }
          create: {
            args: Prisma.BrandCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          createMany: {
            args: Prisma.BrandCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BrandCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>[]
          }
          delete: {
            args: Prisma.BrandCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          update: {
            args: Prisma.BrandCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          deleteMany: {
            args: Prisma.BrandCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BrandCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BrandCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>[]
          }
          upsert: {
            args: Prisma.BrandCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandCategoryPayload>
          }
          aggregate: {
            args: Prisma.BrandCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBrandCategory>
          }
          groupBy: {
            args: Prisma.BrandCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<BrandCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.BrandCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<BrandCategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      Sale: {
        payload: Prisma.$SalePayload<ExtArgs>
        fields: Prisma.SaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findFirst: {
            args: Prisma.SaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findMany: {
            args: Prisma.SaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          create: {
            args: Prisma.SaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          createMany: {
            args: Prisma.SaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SaleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          delete: {
            args: Prisma.SaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          update: {
            args: Prisma.SaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          deleteMany: {
            args: Prisma.SaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SaleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          upsert: {
            args: Prisma.SaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          aggregate: {
            args: Prisma.SaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSale>
          }
          groupBy: {
            args: Prisma.SaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaleCountArgs<ExtArgs>
            result: $Utils.Optional<SaleCountAggregateOutputType> | number
          }
        }
      }
      ProductVariant: {
        payload: Prisma.$ProductVariantPayload<ExtArgs>
        fields: Prisma.ProductVariantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductVariantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductVariantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          findFirst: {
            args: Prisma.ProductVariantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductVariantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          findMany: {
            args: Prisma.ProductVariantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          create: {
            args: Prisma.ProductVariantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          createMany: {
            args: Prisma.ProductVariantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductVariantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          delete: {
            args: Prisma.ProductVariantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          update: {
            args: Prisma.ProductVariantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          deleteMany: {
            args: Prisma.ProductVariantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductVariantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductVariantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          upsert: {
            args: Prisma.ProductVariantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          aggregate: {
            args: Prisma.ProductVariantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductVariant>
          }
          groupBy: {
            args: Prisma.ProductVariantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductVariantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductVariantCountArgs<ExtArgs>
            result: $Utils.Optional<ProductVariantCountAggregateOutputType> | number
          }
        }
      }
      Feature: {
        payload: Prisma.$FeaturePayload<ExtArgs>
        fields: Prisma.FeatureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeatureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeatureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          findFirst: {
            args: Prisma.FeatureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeatureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          findMany: {
            args: Prisma.FeatureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>[]
          }
          create: {
            args: Prisma.FeatureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          createMany: {
            args: Prisma.FeatureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeatureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>[]
          }
          delete: {
            args: Prisma.FeatureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          update: {
            args: Prisma.FeatureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          deleteMany: {
            args: Prisma.FeatureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeatureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeatureUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>[]
          }
          upsert: {
            args: Prisma.FeatureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeaturePayload>
          }
          aggregate: {
            args: Prisma.FeatureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeature>
          }
          groupBy: {
            args: Prisma.FeatureGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeatureGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeatureCountArgs<ExtArgs>
            result: $Utils.Optional<FeatureCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      Mockup: {
        payload: Prisma.$MockupPayload<ExtArgs>
        fields: Prisma.MockupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MockupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MockupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          findFirst: {
            args: Prisma.MockupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MockupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          findMany: {
            args: Prisma.MockupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>[]
          }
          create: {
            args: Prisma.MockupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          createMany: {
            args: Prisma.MockupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MockupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>[]
          }
          delete: {
            args: Prisma.MockupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          update: {
            args: Prisma.MockupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          deleteMany: {
            args: Prisma.MockupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MockupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MockupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>[]
          }
          upsert: {
            args: Prisma.MockupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupPayload>
          }
          aggregate: {
            args: Prisma.MockupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMockup>
          }
          groupBy: {
            args: Prisma.MockupGroupByArgs<ExtArgs>
            result: $Utils.Optional<MockupGroupByOutputType>[]
          }
          count: {
            args: Prisma.MockupCountArgs<ExtArgs>
            result: $Utils.Optional<MockupCountAggregateOutputType> | number
          }
        }
      }
      MockupVariant: {
        payload: Prisma.$MockupVariantPayload<ExtArgs>
        fields: Prisma.MockupVariantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MockupVariantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MockupVariantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          findFirst: {
            args: Prisma.MockupVariantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MockupVariantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          findMany: {
            args: Prisma.MockupVariantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>[]
          }
          create: {
            args: Prisma.MockupVariantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          createMany: {
            args: Prisma.MockupVariantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MockupVariantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>[]
          }
          delete: {
            args: Prisma.MockupVariantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          update: {
            args: Prisma.MockupVariantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          deleteMany: {
            args: Prisma.MockupVariantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MockupVariantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MockupVariantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>[]
          }
          upsert: {
            args: Prisma.MockupVariantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockupVariantPayload>
          }
          aggregate: {
            args: Prisma.MockupVariantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMockupVariant>
          }
          groupBy: {
            args: Prisma.MockupVariantGroupByArgs<ExtArgs>
            result: $Utils.Optional<MockupVariantGroupByOutputType>[]
          }
          count: {
            args: Prisma.MockupVariantCountArgs<ExtArgs>
            result: $Utils.Optional<MockupVariantCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    merchantProfile?: MerchantProfileOmit
    brand?: BrandOmit
    brandCategory?: BrandCategoryOmit
    product?: ProductOmit
    sale?: SaleOmit
    productVariant?: ProductVariantOmit
    feature?: FeatureOmit
    tag?: TagOmit
    mockup?: MockupOmit
    mockupVariant?: MockupVariantOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    brands: number
    products: number
    sales: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    brands?: boolean | UserCountOutputTypeCountBrandsArgs
    products?: boolean | UserCountOutputTypeCountProductsArgs
    sales?: boolean | UserCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBrandsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BrandWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }


  /**
   * Count Type BrandCountOutputType
   */

  export type BrandCountOutputType = {
    Product: number
    Sales: number
  }

  export type BrandCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Product?: boolean | BrandCountOutputTypeCountProductArgs
    Sales?: boolean | BrandCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * BrandCountOutputType without action
   */
  export type BrandCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCountOutputType
     */
    select?: BrandCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BrandCountOutputType without action
   */
  export type BrandCountOutputTypeCountProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }

  /**
   * BrandCountOutputType without action
   */
  export type BrandCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }


  /**
   * Count Type BrandCategoryCountOutputType
   */

  export type BrandCategoryCountOutputType = {
    Brand: number
  }

  export type BrandCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Brand?: boolean | BrandCategoryCountOutputTypeCountBrandArgs
  }

  // Custom InputTypes
  /**
   * BrandCategoryCountOutputType without action
   */
  export type BrandCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategoryCountOutputType
     */
    select?: BrandCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BrandCategoryCountOutputType without action
   */
  export type BrandCategoryCountOutputTypeCountBrandArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BrandWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    features: number
    tags: number
    variants: number
    sales: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    features?: boolean | ProductCountOutputTypeCountFeaturesArgs
    tags?: boolean | ProductCountOutputTypeCountTagsArgs
    variants?: boolean | ProductCountOutputTypeCountVariantsArgs
    sales?: boolean | ProductCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountFeaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeatureWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductVariantWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }


  /**
   * Count Type MockupCountOutputType
   */

  export type MockupCountOutputType = {
    variants: number
    Product: number
  }

  export type MockupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | MockupCountOutputTypeCountVariantsArgs
    Product?: boolean | MockupCountOutputTypeCountProductArgs
  }

  // Custom InputTypes
  /**
   * MockupCountOutputType without action
   */
  export type MockupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupCountOutputType
     */
    select?: MockupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MockupCountOutputType without action
   */
  export type MockupCountOutputTypeCountVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockupVariantWhereInput
  }

  /**
   * MockupCountOutputType without action
   */
  export type MockupCountOutputTypeCountProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    name: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    isActive: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    phone: string | null
    name: string
    password: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    brands?: boolean | User$brandsArgs<ExtArgs>
    products?: boolean | User$productsArgs<ExtArgs>
    sales?: boolean | User$salesArgs<ExtArgs>
    merchantProfile?: boolean | User$merchantProfileArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "phone" | "name" | "password" | "role" | "createdAt" | "updatedAt" | "isActive", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    brands?: boolean | User$brandsArgs<ExtArgs>
    products?: boolean | User$productsArgs<ExtArgs>
    sales?: boolean | User$salesArgs<ExtArgs>
    merchantProfile?: boolean | User$merchantProfileArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      brands: Prisma.$BrandPayload<ExtArgs>[]
      products: Prisma.$ProductPayload<ExtArgs>[]
      sales: Prisma.$SalePayload<ExtArgs>[]
      merchantProfile: Prisma.$MerchantProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      phone: string | null
      name: string
      password: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      isActive: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    brands<T extends User$brandsArgs<ExtArgs> = {}>(args?: Subset<T, User$brandsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    products<T extends User$productsArgs<ExtArgs> = {}>(args?: Subset<T, User$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sales<T extends User$salesArgs<ExtArgs> = {}>(args?: Subset<T, User$salesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    merchantProfile<T extends User$merchantProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$merchantProfileArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly isActive: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.brands
   */
  export type User$brandsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    where?: BrandWhereInput
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    cursor?: BrandWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * User.products
   */
  export type User$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * User.sales
   */
  export type User$salesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * User.merchantProfile
   */
  export type User$merchantProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    where?: MerchantProfileWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model MerchantProfile
   */

  export type AggregateMerchantProfile = {
    _count: MerchantProfileCountAggregateOutputType | null
    _avg: MerchantProfileAvgAggregateOutputType | null
    _sum: MerchantProfileSumAggregateOutputType | null
    _min: MerchantProfileMinAggregateOutputType | null
    _max: MerchantProfileMaxAggregateOutputType | null
  }

  export type MerchantProfileAvgAggregateOutputType = {
    tiar: number | null
  }

  export type MerchantProfileSumAggregateOutputType = {
    tiar: number | null
  }

  export type MerchantProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    dateOfBirth: Date | null
    contactEmail: string | null
    contactPhone: string | null
    nidOrPassportNo: string | null
    presentAddress: string | null
    permanentAddress: string | null
    portfolioUrl: string | null
    websiteUrl: string | null
    bankName: string | null
    bankBranch: string | null
    accountName: string | null
    accountNumber: string | null
    routingNumber: string | null
    message: string | null
    tiar: number | null
    brandOption: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    dateOfBirth: Date | null
    contactEmail: string | null
    contactPhone: string | null
    nidOrPassportNo: string | null
    presentAddress: string | null
    permanentAddress: string | null
    portfolioUrl: string | null
    websiteUrl: string | null
    bankName: string | null
    bankBranch: string | null
    accountName: string | null
    accountNumber: string | null
    routingNumber: string | null
    message: string | null
    tiar: number | null
    brandOption: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantProfileCountAggregateOutputType = {
    id: number
    userId: number
    fullName: number
    dateOfBirth: number
    contactEmail: number
    contactPhone: number
    nidOrPassportNo: number
    presentAddress: number
    permanentAddress: number
    portfolioUrl: number
    websiteUrl: number
    bankName: number
    bankBranch: number
    accountName: number
    accountNumber: number
    routingNumber: number
    message: number
    tiar: number
    brandOption: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MerchantProfileAvgAggregateInputType = {
    tiar?: true
  }

  export type MerchantProfileSumAggregateInputType = {
    tiar?: true
  }

  export type MerchantProfileMinAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    contactEmail?: true
    contactPhone?: true
    nidOrPassportNo?: true
    presentAddress?: true
    permanentAddress?: true
    portfolioUrl?: true
    websiteUrl?: true
    bankName?: true
    bankBranch?: true
    accountName?: true
    accountNumber?: true
    routingNumber?: true
    message?: true
    tiar?: true
    brandOption?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    contactEmail?: true
    contactPhone?: true
    nidOrPassportNo?: true
    presentAddress?: true
    permanentAddress?: true
    portfolioUrl?: true
    websiteUrl?: true
    bankName?: true
    bankBranch?: true
    accountName?: true
    accountNumber?: true
    routingNumber?: true
    message?: true
    tiar?: true
    brandOption?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantProfileCountAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    contactEmail?: true
    contactPhone?: true
    nidOrPassportNo?: true
    presentAddress?: true
    permanentAddress?: true
    portfolioUrl?: true
    websiteUrl?: true
    bankName?: true
    bankBranch?: true
    accountName?: true
    accountNumber?: true
    routingNumber?: true
    message?: true
    tiar?: true
    brandOption?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MerchantProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantProfile to aggregate.
     */
    where?: MerchantProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantProfiles to fetch.
     */
    orderBy?: MerchantProfileOrderByWithRelationInput | MerchantProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchantProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MerchantProfiles
    **/
    _count?: true | MerchantProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MerchantProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MerchantProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchantProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchantProfileMaxAggregateInputType
  }

  export type GetMerchantProfileAggregateType<T extends MerchantProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchantProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchantProfile[P]>
      : GetScalarType<T[P], AggregateMerchantProfile[P]>
  }




  export type MerchantProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantProfileWhereInput
    orderBy?: MerchantProfileOrderByWithAggregationInput | MerchantProfileOrderByWithAggregationInput[]
    by: MerchantProfileScalarFieldEnum[] | MerchantProfileScalarFieldEnum
    having?: MerchantProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchantProfileCountAggregateInputType | true
    _avg?: MerchantProfileAvgAggregateInputType
    _sum?: MerchantProfileSumAggregateInputType
    _min?: MerchantProfileMinAggregateInputType
    _max?: MerchantProfileMaxAggregateInputType
  }

  export type MerchantProfileGroupByOutputType = {
    id: string
    userId: string
    fullName: string
    dateOfBirth: Date
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl: string | null
    websiteUrl: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message: string | null
    tiar: number
    brandOption: boolean
    createdAt: Date
    updatedAt: Date
    _count: MerchantProfileCountAggregateOutputType | null
    _avg: MerchantProfileAvgAggregateOutputType | null
    _sum: MerchantProfileSumAggregateOutputType | null
    _min: MerchantProfileMinAggregateOutputType | null
    _max: MerchantProfileMaxAggregateOutputType | null
  }

  type GetMerchantProfileGroupByPayload<T extends MerchantProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchantProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchantProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchantProfileGroupByOutputType[P]>
            : GetScalarType<T[P], MerchantProfileGroupByOutputType[P]>
        }
      >
    >


  export type MerchantProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    nidOrPassportNo?: boolean
    presentAddress?: boolean
    permanentAddress?: boolean
    portfolioUrl?: boolean
    websiteUrl?: boolean
    bankName?: boolean
    bankBranch?: boolean
    accountName?: boolean
    accountNumber?: boolean
    routingNumber?: boolean
    message?: boolean
    tiar?: boolean
    brandOption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantProfile"]>

  export type MerchantProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    nidOrPassportNo?: boolean
    presentAddress?: boolean
    permanentAddress?: boolean
    portfolioUrl?: boolean
    websiteUrl?: boolean
    bankName?: boolean
    bankBranch?: boolean
    accountName?: boolean
    accountNumber?: boolean
    routingNumber?: boolean
    message?: boolean
    tiar?: boolean
    brandOption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantProfile"]>

  export type MerchantProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    nidOrPassportNo?: boolean
    presentAddress?: boolean
    permanentAddress?: boolean
    portfolioUrl?: boolean
    websiteUrl?: boolean
    bankName?: boolean
    bankBranch?: boolean
    accountName?: boolean
    accountNumber?: boolean
    routingNumber?: boolean
    message?: boolean
    tiar?: boolean
    brandOption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantProfile"]>

  export type MerchantProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    nidOrPassportNo?: boolean
    presentAddress?: boolean
    permanentAddress?: boolean
    portfolioUrl?: boolean
    websiteUrl?: boolean
    bankName?: boolean
    bankBranch?: boolean
    accountName?: boolean
    accountNumber?: boolean
    routingNumber?: boolean
    message?: boolean
    tiar?: boolean
    brandOption?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MerchantProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fullName" | "dateOfBirth" | "contactEmail" | "contactPhone" | "nidOrPassportNo" | "presentAddress" | "permanentAddress" | "portfolioUrl" | "websiteUrl" | "bankName" | "bankBranch" | "accountName" | "accountNumber" | "routingNumber" | "message" | "tiar" | "brandOption" | "createdAt" | "updatedAt", ExtArgs["result"]["merchantProfile"]>
  export type MerchantProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MerchantProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MerchantProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MerchantProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MerchantProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fullName: string
      dateOfBirth: Date
      contactEmail: string
      contactPhone: string
      nidOrPassportNo: string
      presentAddress: string
      permanentAddress: string
      portfolioUrl: string | null
      websiteUrl: string | null
      bankName: string
      bankBranch: string
      accountName: string
      accountNumber: string
      routingNumber: string
      message: string | null
      tiar: number
      brandOption: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["merchantProfile"]>
    composites: {}
  }

  type MerchantProfileGetPayload<S extends boolean | null | undefined | MerchantProfileDefaultArgs> = $Result.GetResult<Prisma.$MerchantProfilePayload, S>

  type MerchantProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MerchantProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MerchantProfileCountAggregateInputType | true
    }

  export interface MerchantProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MerchantProfile'], meta: { name: 'MerchantProfile' } }
    /**
     * Find zero or one MerchantProfile that matches the filter.
     * @param {MerchantProfileFindUniqueArgs} args - Arguments to find a MerchantProfile
     * @example
     * // Get one MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchantProfileFindUniqueArgs>(args: SelectSubset<T, MerchantProfileFindUniqueArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MerchantProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MerchantProfileFindUniqueOrThrowArgs} args - Arguments to find a MerchantProfile
     * @example
     * // Get one MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchantProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchantProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileFindFirstArgs} args - Arguments to find a MerchantProfile
     * @example
     * // Get one MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchantProfileFindFirstArgs>(args?: SelectSubset<T, MerchantProfileFindFirstArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileFindFirstOrThrowArgs} args - Arguments to find a MerchantProfile
     * @example
     * // Get one MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchantProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchantProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MerchantProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MerchantProfiles
     * const merchantProfiles = await prisma.merchantProfile.findMany()
     * 
     * // Get first 10 MerchantProfiles
     * const merchantProfiles = await prisma.merchantProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchantProfileWithIdOnly = await prisma.merchantProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchantProfileFindManyArgs>(args?: SelectSubset<T, MerchantProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MerchantProfile.
     * @param {MerchantProfileCreateArgs} args - Arguments to create a MerchantProfile.
     * @example
     * // Create one MerchantProfile
     * const MerchantProfile = await prisma.merchantProfile.create({
     *   data: {
     *     // ... data to create a MerchantProfile
     *   }
     * })
     * 
     */
    create<T extends MerchantProfileCreateArgs>(args: SelectSubset<T, MerchantProfileCreateArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MerchantProfiles.
     * @param {MerchantProfileCreateManyArgs} args - Arguments to create many MerchantProfiles.
     * @example
     * // Create many MerchantProfiles
     * const merchantProfile = await prisma.merchantProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchantProfileCreateManyArgs>(args?: SelectSubset<T, MerchantProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MerchantProfiles and returns the data saved in the database.
     * @param {MerchantProfileCreateManyAndReturnArgs} args - Arguments to create many MerchantProfiles.
     * @example
     * // Create many MerchantProfiles
     * const merchantProfile = await prisma.merchantProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MerchantProfiles and only return the `id`
     * const merchantProfileWithIdOnly = await prisma.merchantProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchantProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchantProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MerchantProfile.
     * @param {MerchantProfileDeleteArgs} args - Arguments to delete one MerchantProfile.
     * @example
     * // Delete one MerchantProfile
     * const MerchantProfile = await prisma.merchantProfile.delete({
     *   where: {
     *     // ... filter to delete one MerchantProfile
     *   }
     * })
     * 
     */
    delete<T extends MerchantProfileDeleteArgs>(args: SelectSubset<T, MerchantProfileDeleteArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MerchantProfile.
     * @param {MerchantProfileUpdateArgs} args - Arguments to update one MerchantProfile.
     * @example
     * // Update one MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchantProfileUpdateArgs>(args: SelectSubset<T, MerchantProfileUpdateArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MerchantProfiles.
     * @param {MerchantProfileDeleteManyArgs} args - Arguments to filter MerchantProfiles to delete.
     * @example
     * // Delete a few MerchantProfiles
     * const { count } = await prisma.merchantProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchantProfileDeleteManyArgs>(args?: SelectSubset<T, MerchantProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MerchantProfiles
     * const merchantProfile = await prisma.merchantProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchantProfileUpdateManyArgs>(args: SelectSubset<T, MerchantProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantProfiles and returns the data updated in the database.
     * @param {MerchantProfileUpdateManyAndReturnArgs} args - Arguments to update many MerchantProfiles.
     * @example
     * // Update many MerchantProfiles
     * const merchantProfile = await prisma.merchantProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MerchantProfiles and only return the `id`
     * const merchantProfileWithIdOnly = await prisma.merchantProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MerchantProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, MerchantProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MerchantProfile.
     * @param {MerchantProfileUpsertArgs} args - Arguments to update or create a MerchantProfile.
     * @example
     * // Update or create a MerchantProfile
     * const merchantProfile = await prisma.merchantProfile.upsert({
     *   create: {
     *     // ... data to create a MerchantProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MerchantProfile we want to update
     *   }
     * })
     */
    upsert<T extends MerchantProfileUpsertArgs>(args: SelectSubset<T, MerchantProfileUpsertArgs<ExtArgs>>): Prisma__MerchantProfileClient<$Result.GetResult<Prisma.$MerchantProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MerchantProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileCountArgs} args - Arguments to filter MerchantProfiles to count.
     * @example
     * // Count the number of MerchantProfiles
     * const count = await prisma.merchantProfile.count({
     *   where: {
     *     // ... the filter for the MerchantProfiles we want to count
     *   }
     * })
    **/
    count<T extends MerchantProfileCountArgs>(
      args?: Subset<T, MerchantProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchantProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MerchantProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchantProfileAggregateArgs>(args: Subset<T, MerchantProfileAggregateArgs>): Prisma.PrismaPromise<GetMerchantProfileAggregateType<T>>

    /**
     * Group by MerchantProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchantProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchantProfileGroupByArgs['orderBy'] }
        : { orderBy?: MerchantProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchantProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchantProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MerchantProfile model
   */
  readonly fields: MerchantProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MerchantProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchantProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MerchantProfile model
   */
  interface MerchantProfileFieldRefs {
    readonly id: FieldRef<"MerchantProfile", 'String'>
    readonly userId: FieldRef<"MerchantProfile", 'String'>
    readonly fullName: FieldRef<"MerchantProfile", 'String'>
    readonly dateOfBirth: FieldRef<"MerchantProfile", 'DateTime'>
    readonly contactEmail: FieldRef<"MerchantProfile", 'String'>
    readonly contactPhone: FieldRef<"MerchantProfile", 'String'>
    readonly nidOrPassportNo: FieldRef<"MerchantProfile", 'String'>
    readonly presentAddress: FieldRef<"MerchantProfile", 'String'>
    readonly permanentAddress: FieldRef<"MerchantProfile", 'String'>
    readonly portfolioUrl: FieldRef<"MerchantProfile", 'String'>
    readonly websiteUrl: FieldRef<"MerchantProfile", 'String'>
    readonly bankName: FieldRef<"MerchantProfile", 'String'>
    readonly bankBranch: FieldRef<"MerchantProfile", 'String'>
    readonly accountName: FieldRef<"MerchantProfile", 'String'>
    readonly accountNumber: FieldRef<"MerchantProfile", 'String'>
    readonly routingNumber: FieldRef<"MerchantProfile", 'String'>
    readonly message: FieldRef<"MerchantProfile", 'String'>
    readonly tiar: FieldRef<"MerchantProfile", 'Int'>
    readonly brandOption: FieldRef<"MerchantProfile", 'Boolean'>
    readonly createdAt: FieldRef<"MerchantProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"MerchantProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MerchantProfile findUnique
   */
  export type MerchantProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter, which MerchantProfile to fetch.
     */
    where: MerchantProfileWhereUniqueInput
  }

  /**
   * MerchantProfile findUniqueOrThrow
   */
  export type MerchantProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter, which MerchantProfile to fetch.
     */
    where: MerchantProfileWhereUniqueInput
  }

  /**
   * MerchantProfile findFirst
   */
  export type MerchantProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter, which MerchantProfile to fetch.
     */
    where?: MerchantProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantProfiles to fetch.
     */
    orderBy?: MerchantProfileOrderByWithRelationInput | MerchantProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantProfiles.
     */
    cursor?: MerchantProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantProfiles.
     */
    distinct?: MerchantProfileScalarFieldEnum | MerchantProfileScalarFieldEnum[]
  }

  /**
   * MerchantProfile findFirstOrThrow
   */
  export type MerchantProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter, which MerchantProfile to fetch.
     */
    where?: MerchantProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantProfiles to fetch.
     */
    orderBy?: MerchantProfileOrderByWithRelationInput | MerchantProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantProfiles.
     */
    cursor?: MerchantProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantProfiles.
     */
    distinct?: MerchantProfileScalarFieldEnum | MerchantProfileScalarFieldEnum[]
  }

  /**
   * MerchantProfile findMany
   */
  export type MerchantProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter, which MerchantProfiles to fetch.
     */
    where?: MerchantProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantProfiles to fetch.
     */
    orderBy?: MerchantProfileOrderByWithRelationInput | MerchantProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MerchantProfiles.
     */
    cursor?: MerchantProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantProfiles.
     */
    skip?: number
    distinct?: MerchantProfileScalarFieldEnum | MerchantProfileScalarFieldEnum[]
  }

  /**
   * MerchantProfile create
   */
  export type MerchantProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a MerchantProfile.
     */
    data: XOR<MerchantProfileCreateInput, MerchantProfileUncheckedCreateInput>
  }

  /**
   * MerchantProfile createMany
   */
  export type MerchantProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MerchantProfiles.
     */
    data: MerchantProfileCreateManyInput | MerchantProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MerchantProfile createManyAndReturn
   */
  export type MerchantProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * The data used to create many MerchantProfiles.
     */
    data: MerchantProfileCreateManyInput | MerchantProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantProfile update
   */
  export type MerchantProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a MerchantProfile.
     */
    data: XOR<MerchantProfileUpdateInput, MerchantProfileUncheckedUpdateInput>
    /**
     * Choose, which MerchantProfile to update.
     */
    where: MerchantProfileWhereUniqueInput
  }

  /**
   * MerchantProfile updateMany
   */
  export type MerchantProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MerchantProfiles.
     */
    data: XOR<MerchantProfileUpdateManyMutationInput, MerchantProfileUncheckedUpdateManyInput>
    /**
     * Filter which MerchantProfiles to update
     */
    where?: MerchantProfileWhereInput
    /**
     * Limit how many MerchantProfiles to update.
     */
    limit?: number
  }

  /**
   * MerchantProfile updateManyAndReturn
   */
  export type MerchantProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * The data used to update MerchantProfiles.
     */
    data: XOR<MerchantProfileUpdateManyMutationInput, MerchantProfileUncheckedUpdateManyInput>
    /**
     * Filter which MerchantProfiles to update
     */
    where?: MerchantProfileWhereInput
    /**
     * Limit how many MerchantProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantProfile upsert
   */
  export type MerchantProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the MerchantProfile to update in case it exists.
     */
    where: MerchantProfileWhereUniqueInput
    /**
     * In case the MerchantProfile found by the `where` argument doesn't exist, create a new MerchantProfile with this data.
     */
    create: XOR<MerchantProfileCreateInput, MerchantProfileUncheckedCreateInput>
    /**
     * In case the MerchantProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchantProfileUpdateInput, MerchantProfileUncheckedUpdateInput>
  }

  /**
   * MerchantProfile delete
   */
  export type MerchantProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
    /**
     * Filter which MerchantProfile to delete.
     */
    where: MerchantProfileWhereUniqueInput
  }

  /**
   * MerchantProfile deleteMany
   */
  export type MerchantProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantProfiles to delete
     */
    where?: MerchantProfileWhereInput
    /**
     * Limit how many MerchantProfiles to delete.
     */
    limit?: number
  }

  /**
   * MerchantProfile without action
   */
  export type MerchantProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantProfile
     */
    select?: MerchantProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantProfile
     */
    omit?: MerchantProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantProfileInclude<ExtArgs> | null
  }


  /**
   * Model Brand
   */

  export type AggregateBrand = {
    _count: BrandCountAggregateOutputType | null
    _avg: BrandAvgAggregateOutputType | null
    _sum: BrandSumAggregateOutputType | null
    _min: BrandMinAggregateOutputType | null
    _max: BrandMaxAggregateOutputType | null
  }

  export type BrandAvgAggregateOutputType = {
    defaultBrandPct: number | null
    defaultMerchantPct: number | null
  }

  export type BrandSumAggregateOutputType = {
    defaultBrandPct: number | null
    defaultMerchantPct: number | null
  }

  export type BrandMinAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    brandCategoryId: string | null
    userId: string | null
    defaultBrandPct: number | null
    defaultMerchantPct: number | null
  }

  export type BrandMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    brandCategoryId: string | null
    userId: string | null
    defaultBrandPct: number | null
    defaultMerchantPct: number | null
  }

  export type BrandCountAggregateOutputType = {
    id: number
    name: number
    isActive: number
    createdAt: number
    updatedAt: number
    brandCategoryId: number
    userId: number
    defaultBrandPct: number
    defaultMerchantPct: number
    _all: number
  }


  export type BrandAvgAggregateInputType = {
    defaultBrandPct?: true
    defaultMerchantPct?: true
  }

  export type BrandSumAggregateInputType = {
    defaultBrandPct?: true
    defaultMerchantPct?: true
  }

  export type BrandMinAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    brandCategoryId?: true
    userId?: true
    defaultBrandPct?: true
    defaultMerchantPct?: true
  }

  export type BrandMaxAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    brandCategoryId?: true
    userId?: true
    defaultBrandPct?: true
    defaultMerchantPct?: true
  }

  export type BrandCountAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    brandCategoryId?: true
    userId?: true
    defaultBrandPct?: true
    defaultMerchantPct?: true
    _all?: true
  }

  export type BrandAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Brand to aggregate.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Brands
    **/
    _count?: true | BrandCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BrandAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BrandSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BrandMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BrandMaxAggregateInputType
  }

  export type GetBrandAggregateType<T extends BrandAggregateArgs> = {
        [P in keyof T & keyof AggregateBrand]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBrand[P]>
      : GetScalarType<T[P], AggregateBrand[P]>
  }




  export type BrandGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BrandWhereInput
    orderBy?: BrandOrderByWithAggregationInput | BrandOrderByWithAggregationInput[]
    by: BrandScalarFieldEnum[] | BrandScalarFieldEnum
    having?: BrandScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BrandCountAggregateInputType | true
    _avg?: BrandAvgAggregateInputType
    _sum?: BrandSumAggregateInputType
    _min?: BrandMinAggregateInputType
    _max?: BrandMaxAggregateInputType
  }

  export type BrandGroupByOutputType = {
    id: string
    name: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    brandCategoryId: string
    userId: string
    defaultBrandPct: number
    defaultMerchantPct: number
    _count: BrandCountAggregateOutputType | null
    _avg: BrandAvgAggregateOutputType | null
    _sum: BrandSumAggregateOutputType | null
    _min: BrandMinAggregateOutputType | null
    _max: BrandMaxAggregateOutputType | null
  }

  type GetBrandGroupByPayload<T extends BrandGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BrandGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BrandGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BrandGroupByOutputType[P]>
            : GetScalarType<T[P], BrandGroupByOutputType[P]>
        }
      >
    >


  export type BrandSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brandCategoryId?: boolean
    userId?: boolean
    defaultBrandPct?: boolean
    defaultMerchantPct?: boolean
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    Product?: boolean | Brand$ProductArgs<ExtArgs>
    Sales?: boolean | Brand$SalesArgs<ExtArgs>
    _count?: boolean | BrandCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["brand"]>

  export type BrandSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brandCategoryId?: boolean
    userId?: boolean
    defaultBrandPct?: boolean
    defaultMerchantPct?: boolean
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["brand"]>

  export type BrandSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brandCategoryId?: boolean
    userId?: boolean
    defaultBrandPct?: boolean
    defaultMerchantPct?: boolean
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["brand"]>

  export type BrandSelectScalar = {
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brandCategoryId?: boolean
    userId?: boolean
    defaultBrandPct?: boolean
    defaultMerchantPct?: boolean
  }

  export type BrandOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isActive" | "createdAt" | "updatedAt" | "brandCategoryId" | "userId" | "defaultBrandPct" | "defaultMerchantPct", ExtArgs["result"]["brand"]>
  export type BrandInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    Product?: boolean | Brand$ProductArgs<ExtArgs>
    Sales?: boolean | Brand$SalesArgs<ExtArgs>
    _count?: boolean | BrandCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BrandIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BrandIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    brandCategory?: boolean | BrandCategoryDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BrandPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Brand"
    objects: {
      brandCategory: Prisma.$BrandCategoryPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      Product: Prisma.$ProductPayload<ExtArgs>[]
      Sales: Prisma.$SalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      brandCategoryId: string
      userId: string
      defaultBrandPct: number
      defaultMerchantPct: number
    }, ExtArgs["result"]["brand"]>
    composites: {}
  }

  type BrandGetPayload<S extends boolean | null | undefined | BrandDefaultArgs> = $Result.GetResult<Prisma.$BrandPayload, S>

  type BrandCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BrandFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BrandCountAggregateInputType | true
    }

  export interface BrandDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Brand'], meta: { name: 'Brand' } }
    /**
     * Find zero or one Brand that matches the filter.
     * @param {BrandFindUniqueArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BrandFindUniqueArgs>(args: SelectSubset<T, BrandFindUniqueArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Brand that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BrandFindUniqueOrThrowArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BrandFindUniqueOrThrowArgs>(args: SelectSubset<T, BrandFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Brand that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindFirstArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BrandFindFirstArgs>(args?: SelectSubset<T, BrandFindFirstArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Brand that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindFirstOrThrowArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BrandFindFirstOrThrowArgs>(args?: SelectSubset<T, BrandFindFirstOrThrowArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Brands that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Brands
     * const brands = await prisma.brand.findMany()
     * 
     * // Get first 10 Brands
     * const brands = await prisma.brand.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const brandWithIdOnly = await prisma.brand.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BrandFindManyArgs>(args?: SelectSubset<T, BrandFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Brand.
     * @param {BrandCreateArgs} args - Arguments to create a Brand.
     * @example
     * // Create one Brand
     * const Brand = await prisma.brand.create({
     *   data: {
     *     // ... data to create a Brand
     *   }
     * })
     * 
     */
    create<T extends BrandCreateArgs>(args: SelectSubset<T, BrandCreateArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Brands.
     * @param {BrandCreateManyArgs} args - Arguments to create many Brands.
     * @example
     * // Create many Brands
     * const brand = await prisma.brand.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BrandCreateManyArgs>(args?: SelectSubset<T, BrandCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Brands and returns the data saved in the database.
     * @param {BrandCreateManyAndReturnArgs} args - Arguments to create many Brands.
     * @example
     * // Create many Brands
     * const brand = await prisma.brand.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Brands and only return the `id`
     * const brandWithIdOnly = await prisma.brand.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BrandCreateManyAndReturnArgs>(args?: SelectSubset<T, BrandCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Brand.
     * @param {BrandDeleteArgs} args - Arguments to delete one Brand.
     * @example
     * // Delete one Brand
     * const Brand = await prisma.brand.delete({
     *   where: {
     *     // ... filter to delete one Brand
     *   }
     * })
     * 
     */
    delete<T extends BrandDeleteArgs>(args: SelectSubset<T, BrandDeleteArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Brand.
     * @param {BrandUpdateArgs} args - Arguments to update one Brand.
     * @example
     * // Update one Brand
     * const brand = await prisma.brand.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BrandUpdateArgs>(args: SelectSubset<T, BrandUpdateArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Brands.
     * @param {BrandDeleteManyArgs} args - Arguments to filter Brands to delete.
     * @example
     * // Delete a few Brands
     * const { count } = await prisma.brand.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BrandDeleteManyArgs>(args?: SelectSubset<T, BrandDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Brands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Brands
     * const brand = await prisma.brand.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BrandUpdateManyArgs>(args: SelectSubset<T, BrandUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Brands and returns the data updated in the database.
     * @param {BrandUpdateManyAndReturnArgs} args - Arguments to update many Brands.
     * @example
     * // Update many Brands
     * const brand = await prisma.brand.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Brands and only return the `id`
     * const brandWithIdOnly = await prisma.brand.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BrandUpdateManyAndReturnArgs>(args: SelectSubset<T, BrandUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Brand.
     * @param {BrandUpsertArgs} args - Arguments to update or create a Brand.
     * @example
     * // Update or create a Brand
     * const brand = await prisma.brand.upsert({
     *   create: {
     *     // ... data to create a Brand
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Brand we want to update
     *   }
     * })
     */
    upsert<T extends BrandUpsertArgs>(args: SelectSubset<T, BrandUpsertArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Brands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCountArgs} args - Arguments to filter Brands to count.
     * @example
     * // Count the number of Brands
     * const count = await prisma.brand.count({
     *   where: {
     *     // ... the filter for the Brands we want to count
     *   }
     * })
    **/
    count<T extends BrandCountArgs>(
      args?: Subset<T, BrandCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BrandCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Brand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BrandAggregateArgs>(args: Subset<T, BrandAggregateArgs>): Prisma.PrismaPromise<GetBrandAggregateType<T>>

    /**
     * Group by Brand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BrandGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BrandGroupByArgs['orderBy'] }
        : { orderBy?: BrandGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BrandGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBrandGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Brand model
   */
  readonly fields: BrandFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Brand.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BrandClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    brandCategory<T extends BrandCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BrandCategoryDefaultArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Product<T extends Brand$ProductArgs<ExtArgs> = {}>(args?: Subset<T, Brand$ProductArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Sales<T extends Brand$SalesArgs<ExtArgs> = {}>(args?: Subset<T, Brand$SalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Brand model
   */
  interface BrandFieldRefs {
    readonly id: FieldRef<"Brand", 'String'>
    readonly name: FieldRef<"Brand", 'String'>
    readonly isActive: FieldRef<"Brand", 'Boolean'>
    readonly createdAt: FieldRef<"Brand", 'DateTime'>
    readonly updatedAt: FieldRef<"Brand", 'DateTime'>
    readonly brandCategoryId: FieldRef<"Brand", 'String'>
    readonly userId: FieldRef<"Brand", 'String'>
    readonly defaultBrandPct: FieldRef<"Brand", 'Float'>
    readonly defaultMerchantPct: FieldRef<"Brand", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Brand findUnique
   */
  export type BrandFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand findUniqueOrThrow
   */
  export type BrandFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand findFirst
   */
  export type BrandFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Brands.
     */
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand findFirstOrThrow
   */
  export type BrandFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Brands.
     */
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand findMany
   */
  export type BrandFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter, which Brands to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand create
   */
  export type BrandCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * The data needed to create a Brand.
     */
    data: XOR<BrandCreateInput, BrandUncheckedCreateInput>
  }

  /**
   * Brand createMany
   */
  export type BrandCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Brands.
     */
    data: BrandCreateManyInput | BrandCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Brand createManyAndReturn
   */
  export type BrandCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * The data used to create many Brands.
     */
    data: BrandCreateManyInput | BrandCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Brand update
   */
  export type BrandUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * The data needed to update a Brand.
     */
    data: XOR<BrandUpdateInput, BrandUncheckedUpdateInput>
    /**
     * Choose, which Brand to update.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand updateMany
   */
  export type BrandUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Brands.
     */
    data: XOR<BrandUpdateManyMutationInput, BrandUncheckedUpdateManyInput>
    /**
     * Filter which Brands to update
     */
    where?: BrandWhereInput
    /**
     * Limit how many Brands to update.
     */
    limit?: number
  }

  /**
   * Brand updateManyAndReturn
   */
  export type BrandUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * The data used to update Brands.
     */
    data: XOR<BrandUpdateManyMutationInput, BrandUncheckedUpdateManyInput>
    /**
     * Filter which Brands to update
     */
    where?: BrandWhereInput
    /**
     * Limit how many Brands to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Brand upsert
   */
  export type BrandUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * The filter to search for the Brand to update in case it exists.
     */
    where: BrandWhereUniqueInput
    /**
     * In case the Brand found by the `where` argument doesn't exist, create a new Brand with this data.
     */
    create: XOR<BrandCreateInput, BrandUncheckedCreateInput>
    /**
     * In case the Brand was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BrandUpdateInput, BrandUncheckedUpdateInput>
  }

  /**
   * Brand delete
   */
  export type BrandDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    /**
     * Filter which Brand to delete.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand deleteMany
   */
  export type BrandDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Brands to delete
     */
    where?: BrandWhereInput
    /**
     * Limit how many Brands to delete.
     */
    limit?: number
  }

  /**
   * Brand.Product
   */
  export type Brand$ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Brand.Sales
   */
  export type Brand$SalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Brand without action
   */
  export type BrandDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
  }


  /**
   * Model BrandCategory
   */

  export type AggregateBrandCategory = {
    _count: BrandCategoryCountAggregateOutputType | null
    _min: BrandCategoryMinAggregateOutputType | null
    _max: BrandCategoryMaxAggregateOutputType | null
  }

  export type BrandCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BrandCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BrandCategoryCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BrandCategoryMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BrandCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BrandCategoryCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BrandCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BrandCategory to aggregate.
     */
    where?: BrandCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BrandCategories to fetch.
     */
    orderBy?: BrandCategoryOrderByWithRelationInput | BrandCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BrandCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BrandCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BrandCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BrandCategories
    **/
    _count?: true | BrandCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BrandCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BrandCategoryMaxAggregateInputType
  }

  export type GetBrandCategoryAggregateType<T extends BrandCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateBrandCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBrandCategory[P]>
      : GetScalarType<T[P], AggregateBrandCategory[P]>
  }




  export type BrandCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BrandCategoryWhereInput
    orderBy?: BrandCategoryOrderByWithAggregationInput | BrandCategoryOrderByWithAggregationInput[]
    by: BrandCategoryScalarFieldEnum[] | BrandCategoryScalarFieldEnum
    having?: BrandCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BrandCategoryCountAggregateInputType | true
    _min?: BrandCategoryMinAggregateInputType
    _max?: BrandCategoryMaxAggregateInputType
  }

  export type BrandCategoryGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: BrandCategoryCountAggregateOutputType | null
    _min: BrandCategoryMinAggregateOutputType | null
    _max: BrandCategoryMaxAggregateOutputType | null
  }

  type GetBrandCategoryGroupByPayload<T extends BrandCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BrandCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BrandCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BrandCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], BrandCategoryGroupByOutputType[P]>
        }
      >
    >


  export type BrandCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Brand?: boolean | BrandCategory$BrandArgs<ExtArgs>
    _count?: boolean | BrandCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["brandCategory"]>

  export type BrandCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["brandCategory"]>

  export type BrandCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["brandCategory"]>

  export type BrandCategorySelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BrandCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["brandCategory"]>
  export type BrandCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Brand?: boolean | BrandCategory$BrandArgs<ExtArgs>
    _count?: boolean | BrandCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BrandCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BrandCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BrandCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BrandCategory"
    objects: {
      Brand: Prisma.$BrandPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["brandCategory"]>
    composites: {}
  }

  type BrandCategoryGetPayload<S extends boolean | null | undefined | BrandCategoryDefaultArgs> = $Result.GetResult<Prisma.$BrandCategoryPayload, S>

  type BrandCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BrandCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BrandCategoryCountAggregateInputType | true
    }

  export interface BrandCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BrandCategory'], meta: { name: 'BrandCategory' } }
    /**
     * Find zero or one BrandCategory that matches the filter.
     * @param {BrandCategoryFindUniqueArgs} args - Arguments to find a BrandCategory
     * @example
     * // Get one BrandCategory
     * const brandCategory = await prisma.brandCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BrandCategoryFindUniqueArgs>(args: SelectSubset<T, BrandCategoryFindUniqueArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BrandCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BrandCategoryFindUniqueOrThrowArgs} args - Arguments to find a BrandCategory
     * @example
     * // Get one BrandCategory
     * const brandCategory = await prisma.brandCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BrandCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, BrandCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BrandCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryFindFirstArgs} args - Arguments to find a BrandCategory
     * @example
     * // Get one BrandCategory
     * const brandCategory = await prisma.brandCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BrandCategoryFindFirstArgs>(args?: SelectSubset<T, BrandCategoryFindFirstArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BrandCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryFindFirstOrThrowArgs} args - Arguments to find a BrandCategory
     * @example
     * // Get one BrandCategory
     * const brandCategory = await prisma.brandCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BrandCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, BrandCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BrandCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BrandCategories
     * const brandCategories = await prisma.brandCategory.findMany()
     * 
     * // Get first 10 BrandCategories
     * const brandCategories = await prisma.brandCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const brandCategoryWithIdOnly = await prisma.brandCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BrandCategoryFindManyArgs>(args?: SelectSubset<T, BrandCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BrandCategory.
     * @param {BrandCategoryCreateArgs} args - Arguments to create a BrandCategory.
     * @example
     * // Create one BrandCategory
     * const BrandCategory = await prisma.brandCategory.create({
     *   data: {
     *     // ... data to create a BrandCategory
     *   }
     * })
     * 
     */
    create<T extends BrandCategoryCreateArgs>(args: SelectSubset<T, BrandCategoryCreateArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BrandCategories.
     * @param {BrandCategoryCreateManyArgs} args - Arguments to create many BrandCategories.
     * @example
     * // Create many BrandCategories
     * const brandCategory = await prisma.brandCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BrandCategoryCreateManyArgs>(args?: SelectSubset<T, BrandCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BrandCategories and returns the data saved in the database.
     * @param {BrandCategoryCreateManyAndReturnArgs} args - Arguments to create many BrandCategories.
     * @example
     * // Create many BrandCategories
     * const brandCategory = await prisma.brandCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BrandCategories and only return the `id`
     * const brandCategoryWithIdOnly = await prisma.brandCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BrandCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, BrandCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BrandCategory.
     * @param {BrandCategoryDeleteArgs} args - Arguments to delete one BrandCategory.
     * @example
     * // Delete one BrandCategory
     * const BrandCategory = await prisma.brandCategory.delete({
     *   where: {
     *     // ... filter to delete one BrandCategory
     *   }
     * })
     * 
     */
    delete<T extends BrandCategoryDeleteArgs>(args: SelectSubset<T, BrandCategoryDeleteArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BrandCategory.
     * @param {BrandCategoryUpdateArgs} args - Arguments to update one BrandCategory.
     * @example
     * // Update one BrandCategory
     * const brandCategory = await prisma.brandCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BrandCategoryUpdateArgs>(args: SelectSubset<T, BrandCategoryUpdateArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BrandCategories.
     * @param {BrandCategoryDeleteManyArgs} args - Arguments to filter BrandCategories to delete.
     * @example
     * // Delete a few BrandCategories
     * const { count } = await prisma.brandCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BrandCategoryDeleteManyArgs>(args?: SelectSubset<T, BrandCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BrandCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BrandCategories
     * const brandCategory = await prisma.brandCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BrandCategoryUpdateManyArgs>(args: SelectSubset<T, BrandCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BrandCategories and returns the data updated in the database.
     * @param {BrandCategoryUpdateManyAndReturnArgs} args - Arguments to update many BrandCategories.
     * @example
     * // Update many BrandCategories
     * const brandCategory = await prisma.brandCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BrandCategories and only return the `id`
     * const brandCategoryWithIdOnly = await prisma.brandCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BrandCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, BrandCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BrandCategory.
     * @param {BrandCategoryUpsertArgs} args - Arguments to update or create a BrandCategory.
     * @example
     * // Update or create a BrandCategory
     * const brandCategory = await prisma.brandCategory.upsert({
     *   create: {
     *     // ... data to create a BrandCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BrandCategory we want to update
     *   }
     * })
     */
    upsert<T extends BrandCategoryUpsertArgs>(args: SelectSubset<T, BrandCategoryUpsertArgs<ExtArgs>>): Prisma__BrandCategoryClient<$Result.GetResult<Prisma.$BrandCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BrandCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryCountArgs} args - Arguments to filter BrandCategories to count.
     * @example
     * // Count the number of BrandCategories
     * const count = await prisma.brandCategory.count({
     *   where: {
     *     // ... the filter for the BrandCategories we want to count
     *   }
     * })
    **/
    count<T extends BrandCategoryCountArgs>(
      args?: Subset<T, BrandCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BrandCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BrandCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BrandCategoryAggregateArgs>(args: Subset<T, BrandCategoryAggregateArgs>): Prisma.PrismaPromise<GetBrandCategoryAggregateType<T>>

    /**
     * Group by BrandCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BrandCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BrandCategoryGroupByArgs['orderBy'] }
        : { orderBy?: BrandCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BrandCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBrandCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BrandCategory model
   */
  readonly fields: BrandCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BrandCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BrandCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Brand<T extends BrandCategory$BrandArgs<ExtArgs> = {}>(args?: Subset<T, BrandCategory$BrandArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BrandCategory model
   */
  interface BrandCategoryFieldRefs {
    readonly id: FieldRef<"BrandCategory", 'String'>
    readonly name: FieldRef<"BrandCategory", 'String'>
    readonly createdAt: FieldRef<"BrandCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"BrandCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BrandCategory findUnique
   */
  export type BrandCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BrandCategory to fetch.
     */
    where: BrandCategoryWhereUniqueInput
  }

  /**
   * BrandCategory findUniqueOrThrow
   */
  export type BrandCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BrandCategory to fetch.
     */
    where: BrandCategoryWhereUniqueInput
  }

  /**
   * BrandCategory findFirst
   */
  export type BrandCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BrandCategory to fetch.
     */
    where?: BrandCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BrandCategories to fetch.
     */
    orderBy?: BrandCategoryOrderByWithRelationInput | BrandCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BrandCategories.
     */
    cursor?: BrandCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BrandCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BrandCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BrandCategories.
     */
    distinct?: BrandCategoryScalarFieldEnum | BrandCategoryScalarFieldEnum[]
  }

  /**
   * BrandCategory findFirstOrThrow
   */
  export type BrandCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BrandCategory to fetch.
     */
    where?: BrandCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BrandCategories to fetch.
     */
    orderBy?: BrandCategoryOrderByWithRelationInput | BrandCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BrandCategories.
     */
    cursor?: BrandCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BrandCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BrandCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BrandCategories.
     */
    distinct?: BrandCategoryScalarFieldEnum | BrandCategoryScalarFieldEnum[]
  }

  /**
   * BrandCategory findMany
   */
  export type BrandCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter, which BrandCategories to fetch.
     */
    where?: BrandCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BrandCategories to fetch.
     */
    orderBy?: BrandCategoryOrderByWithRelationInput | BrandCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BrandCategories.
     */
    cursor?: BrandCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BrandCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BrandCategories.
     */
    skip?: number
    distinct?: BrandCategoryScalarFieldEnum | BrandCategoryScalarFieldEnum[]
  }

  /**
   * BrandCategory create
   */
  export type BrandCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a BrandCategory.
     */
    data: XOR<BrandCategoryCreateInput, BrandCategoryUncheckedCreateInput>
  }

  /**
   * BrandCategory createMany
   */
  export type BrandCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BrandCategories.
     */
    data: BrandCategoryCreateManyInput | BrandCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BrandCategory createManyAndReturn
   */
  export type BrandCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many BrandCategories.
     */
    data: BrandCategoryCreateManyInput | BrandCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BrandCategory update
   */
  export type BrandCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a BrandCategory.
     */
    data: XOR<BrandCategoryUpdateInput, BrandCategoryUncheckedUpdateInput>
    /**
     * Choose, which BrandCategory to update.
     */
    where: BrandCategoryWhereUniqueInput
  }

  /**
   * BrandCategory updateMany
   */
  export type BrandCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BrandCategories.
     */
    data: XOR<BrandCategoryUpdateManyMutationInput, BrandCategoryUncheckedUpdateManyInput>
    /**
     * Filter which BrandCategories to update
     */
    where?: BrandCategoryWhereInput
    /**
     * Limit how many BrandCategories to update.
     */
    limit?: number
  }

  /**
   * BrandCategory updateManyAndReturn
   */
  export type BrandCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * The data used to update BrandCategories.
     */
    data: XOR<BrandCategoryUpdateManyMutationInput, BrandCategoryUncheckedUpdateManyInput>
    /**
     * Filter which BrandCategories to update
     */
    where?: BrandCategoryWhereInput
    /**
     * Limit how many BrandCategories to update.
     */
    limit?: number
  }

  /**
   * BrandCategory upsert
   */
  export type BrandCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the BrandCategory to update in case it exists.
     */
    where: BrandCategoryWhereUniqueInput
    /**
     * In case the BrandCategory found by the `where` argument doesn't exist, create a new BrandCategory with this data.
     */
    create: XOR<BrandCategoryCreateInput, BrandCategoryUncheckedCreateInput>
    /**
     * In case the BrandCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BrandCategoryUpdateInput, BrandCategoryUncheckedUpdateInput>
  }

  /**
   * BrandCategory delete
   */
  export type BrandCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
    /**
     * Filter which BrandCategory to delete.
     */
    where: BrandCategoryWhereUniqueInput
  }

  /**
   * BrandCategory deleteMany
   */
  export type BrandCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BrandCategories to delete
     */
    where?: BrandCategoryWhereInput
    /**
     * Limit how many BrandCategories to delete.
     */
    limit?: number
  }

  /**
   * BrandCategory.Brand
   */
  export type BrandCategory$BrandArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    where?: BrandWhereInput
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    cursor?: BrandWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * BrandCategory without action
   */
  export type BrandCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BrandCategory
     */
    select?: BrandCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BrandCategory
     */
    omit?: BrandCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: number | null
    brandCommissionPct: number | null
    merchantCommissionPct: number | null
  }

  export type ProductSumAggregateOutputType = {
    price: number | null
    brandCommissionPct: number | null
    merchantCommissionPct: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    productId: string | null
    title: string | null
    description: string | null
    price: number | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
    brandName: string | null
    brandId: string | null
    mockupId: string | null
    userId: string | null
    visibility: boolean | null
    backDesign: string | null
    frontDesign: string | null
    brandCommissionPct: number | null
    merchantCommissionPct: number | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    title: string | null
    description: string | null
    price: number | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
    brandName: string | null
    brandId: string | null
    mockupId: string | null
    userId: string | null
    visibility: boolean | null
    backDesign: string | null
    frontDesign: string | null
    brandCommissionPct: number | null
    merchantCommissionPct: number | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    productId: number
    title: number
    description: number
    price: number
    createdAt: number
    updatedAt: number
    isActive: number
    brandName: number
    brandId: number
    mockupId: number
    userId: number
    visibility: number
    backDesign: number
    frontDesign: number
    brandCommissionPct: number
    merchantCommissionPct: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
    brandCommissionPct?: true
    merchantCommissionPct?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
    brandCommissionPct?: true
    merchantCommissionPct?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    productId?: true
    title?: true
    description?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    brandName?: true
    brandId?: true
    mockupId?: true
    userId?: true
    visibility?: true
    backDesign?: true
    frontDesign?: true
    brandCommissionPct?: true
    merchantCommissionPct?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    productId?: true
    title?: true
    description?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    brandName?: true
    brandId?: true
    mockupId?: true
    userId?: true
    visibility?: true
    backDesign?: true
    frontDesign?: true
    brandCommissionPct?: true
    merchantCommissionPct?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    productId?: true
    title?: true
    description?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    brandName?: true
    brandId?: true
    mockupId?: true
    userId?: true
    visibility?: true
    backDesign?: true
    frontDesign?: true
    brandCommissionPct?: true
    merchantCommissionPct?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    productId: string
    title: string
    description: string | null
    price: number
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    brandName: string | null
    brandId: string | null
    mockupId: string
    userId: string
    visibility: boolean
    backDesign: string | null
    frontDesign: string
    brandCommissionPct: number | null
    merchantCommissionPct: number | null
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    brandName?: boolean
    brandId?: boolean
    mockupId?: boolean
    userId?: boolean
    visibility?: boolean
    backDesign?: boolean
    frontDesign?: boolean
    brandCommissionPct?: boolean
    merchantCommissionPct?: boolean
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    features?: boolean | Product$featuresArgs<ExtArgs>
    tags?: boolean | Product$tagsArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    variants?: boolean | Product$variantsArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
    sales?: boolean | Product$salesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    brandName?: boolean
    brandId?: boolean
    mockupId?: boolean
    userId?: boolean
    visibility?: boolean
    backDesign?: boolean
    frontDesign?: boolean
    brandCommissionPct?: boolean
    merchantCommissionPct?: boolean
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    brandName?: boolean
    brandId?: boolean
    mockupId?: boolean
    userId?: boolean
    visibility?: boolean
    backDesign?: boolean
    frontDesign?: boolean
    brandCommissionPct?: boolean
    merchantCommissionPct?: boolean
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    productId?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    brandName?: boolean
    brandId?: boolean
    mockupId?: boolean
    userId?: boolean
    visibility?: boolean
    backDesign?: boolean
    frontDesign?: boolean
    brandCommissionPct?: boolean
    merchantCommissionPct?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "title" | "description" | "price" | "createdAt" | "updatedAt" | "isActive" | "brandName" | "brandId" | "mockupId" | "userId" | "visibility" | "backDesign" | "frontDesign" | "brandCommissionPct" | "merchantCommissionPct", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    features?: boolean | Product$featuresArgs<ExtArgs>
    tags?: boolean | Product$tagsArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    variants?: boolean | Product$variantsArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
    sales?: boolean | Product$salesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Brand?: boolean | Product$BrandArgs<ExtArgs>
    Mockup?: boolean | MockupDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      Brand: Prisma.$BrandPayload<ExtArgs> | null
      features: Prisma.$FeaturePayload<ExtArgs>[]
      tags: Prisma.$TagPayload<ExtArgs>[]
      Mockup: Prisma.$MockupPayload<ExtArgs>
      variants: Prisma.$ProductVariantPayload<ExtArgs>[]
      User: Prisma.$UserPayload<ExtArgs>
      sales: Prisma.$SalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      title: string
      description: string | null
      price: number
      createdAt: Date
      updatedAt: Date
      isActive: boolean
      brandName: string | null
      brandId: string | null
      mockupId: string
      userId: string
      visibility: boolean
      backDesign: string | null
      frontDesign: string
      brandCommissionPct: number | null
      merchantCommissionPct: number | null
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Brand<T extends Product$BrandArgs<ExtArgs> = {}>(args?: Subset<T, Product$BrandArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    features<T extends Product$featuresArgs<ExtArgs> = {}>(args?: Subset<T, Product$featuresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tags<T extends Product$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Product$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Mockup<T extends MockupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MockupDefaultArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    variants<T extends Product$variantsArgs<ExtArgs> = {}>(args?: Subset<T, Product$variantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sales<T extends Product$salesArgs<ExtArgs> = {}>(args?: Subset<T, Product$salesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly productId: FieldRef<"Product", 'String'>
    readonly title: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Float'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly brandName: FieldRef<"Product", 'String'>
    readonly brandId: FieldRef<"Product", 'String'>
    readonly mockupId: FieldRef<"Product", 'String'>
    readonly userId: FieldRef<"Product", 'String'>
    readonly visibility: FieldRef<"Product", 'Boolean'>
    readonly backDesign: FieldRef<"Product", 'String'>
    readonly frontDesign: FieldRef<"Product", 'String'>
    readonly brandCommissionPct: FieldRef<"Product", 'Float'>
    readonly merchantCommissionPct: FieldRef<"Product", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.Brand
   */
  export type Product$BrandArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    where?: BrandWhereInput
  }

  /**
   * Product.features
   */
  export type Product$featuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    where?: FeatureWhereInput
    orderBy?: FeatureOrderByWithRelationInput | FeatureOrderByWithRelationInput[]
    cursor?: FeatureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeatureScalarFieldEnum | FeatureScalarFieldEnum[]
  }

  /**
   * Product.tags
   */
  export type Product$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    cursor?: TagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Product.variants
   */
  export type Product$variantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    where?: ProductVariantWhereInput
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    cursor?: ProductVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * Product.sales
   */
  export type Product$salesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model Sale
   */

  export type AggregateSale = {
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  export type SaleAvgAggregateOutputType = {
    quantity: number | null
    total: number | null
    brandEarning: number | null
    merchantEarning: number | null
    platformEarning: number | null
  }

  export type SaleSumAggregateOutputType = {
    quantity: number | null
    total: number | null
    brandEarning: number | null
    merchantEarning: number | null
    platformEarning: number | null
  }

  export type SaleMinAggregateOutputType = {
    id: string | null
    productId: string | null
    merchantId: string | null
    brandId: string | null
    quantity: number | null
    total: number | null
    brandEarning: number | null
    merchantEarning: number | null
    platformEarning: number | null
    createdAt: Date | null
  }

  export type SaleMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    merchantId: string | null
    brandId: string | null
    quantity: number | null
    total: number | null
    brandEarning: number | null
    merchantEarning: number | null
    platformEarning: number | null
    createdAt: Date | null
  }

  export type SaleCountAggregateOutputType = {
    id: number
    productId: number
    merchantId: number
    brandId: number
    quantity: number
    total: number
    brandEarning: number
    merchantEarning: number
    platformEarning: number
    createdAt: number
    _all: number
  }


  export type SaleAvgAggregateInputType = {
    quantity?: true
    total?: true
    brandEarning?: true
    merchantEarning?: true
    platformEarning?: true
  }

  export type SaleSumAggregateInputType = {
    quantity?: true
    total?: true
    brandEarning?: true
    merchantEarning?: true
    platformEarning?: true
  }

  export type SaleMinAggregateInputType = {
    id?: true
    productId?: true
    merchantId?: true
    brandId?: true
    quantity?: true
    total?: true
    brandEarning?: true
    merchantEarning?: true
    platformEarning?: true
    createdAt?: true
  }

  export type SaleMaxAggregateInputType = {
    id?: true
    productId?: true
    merchantId?: true
    brandId?: true
    quantity?: true
    total?: true
    brandEarning?: true
    merchantEarning?: true
    platformEarning?: true
    createdAt?: true
  }

  export type SaleCountAggregateInputType = {
    id?: true
    productId?: true
    merchantId?: true
    brandId?: true
    quantity?: true
    total?: true
    brandEarning?: true
    merchantEarning?: true
    platformEarning?: true
    createdAt?: true
    _all?: true
  }

  export type SaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sale to aggregate.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sales
    **/
    _count?: true | SaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleMaxAggregateInputType
  }

  export type GetSaleAggregateType<T extends SaleAggregateArgs> = {
        [P in keyof T & keyof AggregateSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSale[P]>
      : GetScalarType<T[P], AggregateSale[P]>
  }




  export type SaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithAggregationInput | SaleOrderByWithAggregationInput[]
    by: SaleScalarFieldEnum[] | SaleScalarFieldEnum
    having?: SaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleCountAggregateInputType | true
    _avg?: SaleAvgAggregateInputType
    _sum?: SaleSumAggregateInputType
    _min?: SaleMinAggregateInputType
    _max?: SaleMaxAggregateInputType
  }

  export type SaleGroupByOutputType = {
    id: string
    productId: string
    merchantId: string
    brandId: string | null
    quantity: number
    total: number
    brandEarning: number
    merchantEarning: number
    platformEarning: number
    createdAt: Date
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  type GetSaleGroupByPayload<T extends SaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleGroupByOutputType[P]>
            : GetScalarType<T[P], SaleGroupByOutputType[P]>
        }
      >
    >


  export type SaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    merchantId?: boolean
    brandId?: boolean
    quantity?: boolean
    total?: boolean
    brandEarning?: boolean
    merchantEarning?: boolean
    platformEarning?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>

  export type SaleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    merchantId?: boolean
    brandId?: boolean
    quantity?: boolean
    total?: boolean
    brandEarning?: boolean
    merchantEarning?: boolean
    platformEarning?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>

  export type SaleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    merchantId?: boolean
    brandId?: boolean
    quantity?: boolean
    total?: boolean
    brandEarning?: boolean
    merchantEarning?: boolean
    platformEarning?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>

  export type SaleSelectScalar = {
    id?: boolean
    productId?: boolean
    merchantId?: boolean
    brandId?: boolean
    quantity?: boolean
    total?: boolean
    brandEarning?: boolean
    merchantEarning?: boolean
    platformEarning?: boolean
    createdAt?: boolean
  }

  export type SaleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "merchantId" | "brandId" | "quantity" | "total" | "brandEarning" | "merchantEarning" | "platformEarning" | "createdAt", ExtArgs["result"]["sale"]>
  export type SaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }
  export type SaleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }
  export type SaleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    merchant?: boolean | UserDefaultArgs<ExtArgs>
    brand?: boolean | Sale$brandArgs<ExtArgs>
  }

  export type $SalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sale"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      merchant: Prisma.$UserPayload<ExtArgs>
      brand: Prisma.$BrandPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      merchantId: string
      brandId: string | null
      quantity: number
      total: number
      brandEarning: number
      merchantEarning: number
      platformEarning: number
      createdAt: Date
    }, ExtArgs["result"]["sale"]>
    composites: {}
  }

  type SaleGetPayload<S extends boolean | null | undefined | SaleDefaultArgs> = $Result.GetResult<Prisma.$SalePayload, S>

  type SaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SaleCountAggregateInputType | true
    }

  export interface SaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sale'], meta: { name: 'Sale' } }
    /**
     * Find zero or one Sale that matches the filter.
     * @param {SaleFindUniqueArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaleFindUniqueArgs>(args: SelectSubset<T, SaleFindUniqueArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SaleFindUniqueOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaleFindUniqueOrThrowArgs>(args: SelectSubset<T, SaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaleFindFirstArgs>(args?: SelectSubset<T, SaleFindFirstArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaleFindFirstOrThrowArgs>(args?: SelectSubset<T, SaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sales
     * const sales = await prisma.sale.findMany()
     * 
     * // Get first 10 Sales
     * const sales = await prisma.sale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleWithIdOnly = await prisma.sale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaleFindManyArgs>(args?: SelectSubset<T, SaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sale.
     * @param {SaleCreateArgs} args - Arguments to create a Sale.
     * @example
     * // Create one Sale
     * const Sale = await prisma.sale.create({
     *   data: {
     *     // ... data to create a Sale
     *   }
     * })
     * 
     */
    create<T extends SaleCreateArgs>(args: SelectSubset<T, SaleCreateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sales.
     * @param {SaleCreateManyArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaleCreateManyArgs>(args?: SelectSubset<T, SaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sales and returns the data saved in the database.
     * @param {SaleCreateManyAndReturnArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sales and only return the `id`
     * const saleWithIdOnly = await prisma.sale.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SaleCreateManyAndReturnArgs>(args?: SelectSubset<T, SaleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sale.
     * @param {SaleDeleteArgs} args - Arguments to delete one Sale.
     * @example
     * // Delete one Sale
     * const Sale = await prisma.sale.delete({
     *   where: {
     *     // ... filter to delete one Sale
     *   }
     * })
     * 
     */
    delete<T extends SaleDeleteArgs>(args: SelectSubset<T, SaleDeleteArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sale.
     * @param {SaleUpdateArgs} args - Arguments to update one Sale.
     * @example
     * // Update one Sale
     * const sale = await prisma.sale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaleUpdateArgs>(args: SelectSubset<T, SaleUpdateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sales.
     * @param {SaleDeleteManyArgs} args - Arguments to filter Sales to delete.
     * @example
     * // Delete a few Sales
     * const { count } = await prisma.sale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaleDeleteManyArgs>(args?: SelectSubset<T, SaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sales
     * const sale = await prisma.sale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaleUpdateManyArgs>(args: SelectSubset<T, SaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sales and returns the data updated in the database.
     * @param {SaleUpdateManyAndReturnArgs} args - Arguments to update many Sales.
     * @example
     * // Update many Sales
     * const sale = await prisma.sale.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sales and only return the `id`
     * const saleWithIdOnly = await prisma.sale.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SaleUpdateManyAndReturnArgs>(args: SelectSubset<T, SaleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sale.
     * @param {SaleUpsertArgs} args - Arguments to update or create a Sale.
     * @example
     * // Update or create a Sale
     * const sale = await prisma.sale.upsert({
     *   create: {
     *     // ... data to create a Sale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sale we want to update
     *   }
     * })
     */
    upsert<T extends SaleUpsertArgs>(args: SelectSubset<T, SaleUpsertArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleCountArgs} args - Arguments to filter Sales to count.
     * @example
     * // Count the number of Sales
     * const count = await prisma.sale.count({
     *   where: {
     *     // ... the filter for the Sales we want to count
     *   }
     * })
    **/
    count<T extends SaleCountArgs>(
      args?: Subset<T, SaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleAggregateArgs>(args: Subset<T, SaleAggregateArgs>): Prisma.PrismaPromise<GetSaleAggregateType<T>>

    /**
     * Group by Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleGroupByArgs['orderBy'] }
        : { orderBy?: SaleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sale model
   */
  readonly fields: SaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    merchant<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    brand<T extends Sale$brandArgs<ExtArgs> = {}>(args?: Subset<T, Sale$brandArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sale model
   */
  interface SaleFieldRefs {
    readonly id: FieldRef<"Sale", 'String'>
    readonly productId: FieldRef<"Sale", 'String'>
    readonly merchantId: FieldRef<"Sale", 'String'>
    readonly brandId: FieldRef<"Sale", 'String'>
    readonly quantity: FieldRef<"Sale", 'Int'>
    readonly total: FieldRef<"Sale", 'Float'>
    readonly brandEarning: FieldRef<"Sale", 'Float'>
    readonly merchantEarning: FieldRef<"Sale", 'Float'>
    readonly platformEarning: FieldRef<"Sale", 'Float'>
    readonly createdAt: FieldRef<"Sale", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sale findUnique
   */
  export type SaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findUniqueOrThrow
   */
  export type SaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findFirst
   */
  export type SaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findFirstOrThrow
   */
  export type SaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findMany
   */
  export type SaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sales to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale create
   */
  export type SaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to create a Sale.
     */
    data: XOR<SaleCreateInput, SaleUncheckedCreateInput>
  }

  /**
   * Sale createMany
   */
  export type SaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sales.
     */
    data: SaleCreateManyInput | SaleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sale createManyAndReturn
   */
  export type SaleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * The data used to create many Sales.
     */
    data: SaleCreateManyInput | SaleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sale update
   */
  export type SaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to update a Sale.
     */
    data: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
    /**
     * Choose, which Sale to update.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale updateMany
   */
  export type SaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sales.
     */
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyInput>
    /**
     * Filter which Sales to update
     */
    where?: SaleWhereInput
    /**
     * Limit how many Sales to update.
     */
    limit?: number
  }

  /**
   * Sale updateManyAndReturn
   */
  export type SaleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * The data used to update Sales.
     */
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyInput>
    /**
     * Filter which Sales to update
     */
    where?: SaleWhereInput
    /**
     * Limit how many Sales to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sale upsert
   */
  export type SaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The filter to search for the Sale to update in case it exists.
     */
    where: SaleWhereUniqueInput
    /**
     * In case the Sale found by the `where` argument doesn't exist, create a new Sale with this data.
     */
    create: XOR<SaleCreateInput, SaleUncheckedCreateInput>
    /**
     * In case the Sale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
  }

  /**
   * Sale delete
   */
  export type SaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter which Sale to delete.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale deleteMany
   */
  export type SaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sales to delete
     */
    where?: SaleWhereInput
    /**
     * Limit how many Sales to delete.
     */
    limit?: number
  }

  /**
   * Sale.brand
   */
  export type Sale$brandArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BrandInclude<ExtArgs> | null
    where?: BrandWhereInput
  }

  /**
   * Sale without action
   */
  export type SaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
  }


  /**
   * Model ProductVariant
   */

  export type AggregateProductVariant = {
    _count: ProductVariantCountAggregateOutputType | null
    _min: ProductVariantMinAggregateOutputType | null
    _max: ProductVariantMaxAggregateOutputType | null
  }

  export type ProductVariantMinAggregateOutputType = {
    id: string | null
    productId: string | null
    color: string | null
    fitType: $Enums.FitType | null
    frontImg: string | null
    backImg: string | null
  }

  export type ProductVariantMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    color: string | null
    fitType: $Enums.FitType | null
    frontImg: string | null
    backImg: string | null
  }

  export type ProductVariantCountAggregateOutputType = {
    id: number
    productId: number
    color: number
    fitType: number
    frontImg: number
    backImg: number
    _all: number
  }


  export type ProductVariantMinAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
  }

  export type ProductVariantMaxAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
  }

  export type ProductVariantCountAggregateInputType = {
    id?: true
    productId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
    _all?: true
  }

  export type ProductVariantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductVariant to aggregate.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductVariants
    **/
    _count?: true | ProductVariantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductVariantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductVariantMaxAggregateInputType
  }

  export type GetProductVariantAggregateType<T extends ProductVariantAggregateArgs> = {
        [P in keyof T & keyof AggregateProductVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductVariant[P]>
      : GetScalarType<T[P], AggregateProductVariant[P]>
  }




  export type ProductVariantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductVariantWhereInput
    orderBy?: ProductVariantOrderByWithAggregationInput | ProductVariantOrderByWithAggregationInput[]
    by: ProductVariantScalarFieldEnum[] | ProductVariantScalarFieldEnum
    having?: ProductVariantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductVariantCountAggregateInputType | true
    _min?: ProductVariantMinAggregateInputType
    _max?: ProductVariantMaxAggregateInputType
  }

  export type ProductVariantGroupByOutputType = {
    id: string
    productId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string | null
    _count: ProductVariantCountAggregateOutputType | null
    _min: ProductVariantMinAggregateOutputType | null
    _max: ProductVariantMaxAggregateOutputType | null
  }

  type GetProductVariantGroupByPayload<T extends ProductVariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductVariantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductVariantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductVariantGroupByOutputType[P]>
            : GetScalarType<T[P], ProductVariantGroupByOutputType[P]>
        }
      >
    >


  export type ProductVariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectScalar = {
    id?: boolean
    productId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
  }

  export type ProductVariantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "color" | "fitType" | "frontImg" | "backImg", ExtArgs["result"]["productVariant"]>
  export type ProductVariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductVariantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductVariantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductVariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductVariant"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      color: string
      fitType: $Enums.FitType
      frontImg: string
      backImg: string | null
    }, ExtArgs["result"]["productVariant"]>
    composites: {}
  }

  type ProductVariantGetPayload<S extends boolean | null | undefined | ProductVariantDefaultArgs> = $Result.GetResult<Prisma.$ProductVariantPayload, S>

  type ProductVariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductVariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductVariantCountAggregateInputType | true
    }

  export interface ProductVariantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductVariant'], meta: { name: 'ProductVariant' } }
    /**
     * Find zero or one ProductVariant that matches the filter.
     * @param {ProductVariantFindUniqueArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductVariantFindUniqueArgs>(args: SelectSubset<T, ProductVariantFindUniqueArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductVariant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductVariantFindUniqueOrThrowArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductVariantFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductVariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductVariant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindFirstArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductVariantFindFirstArgs>(args?: SelectSubset<T, ProductVariantFindFirstArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductVariant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindFirstOrThrowArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductVariantFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductVariantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductVariants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductVariants
     * const productVariants = await prisma.productVariant.findMany()
     * 
     * // Get first 10 ProductVariants
     * const productVariants = await prisma.productVariant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductVariantFindManyArgs>(args?: SelectSubset<T, ProductVariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductVariant.
     * @param {ProductVariantCreateArgs} args - Arguments to create a ProductVariant.
     * @example
     * // Create one ProductVariant
     * const ProductVariant = await prisma.productVariant.create({
     *   data: {
     *     // ... data to create a ProductVariant
     *   }
     * })
     * 
     */
    create<T extends ProductVariantCreateArgs>(args: SelectSubset<T, ProductVariantCreateArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductVariants.
     * @param {ProductVariantCreateManyArgs} args - Arguments to create many ProductVariants.
     * @example
     * // Create many ProductVariants
     * const productVariant = await prisma.productVariant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductVariantCreateManyArgs>(args?: SelectSubset<T, ProductVariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductVariants and returns the data saved in the database.
     * @param {ProductVariantCreateManyAndReturnArgs} args - Arguments to create many ProductVariants.
     * @example
     * // Create many ProductVariants
     * const productVariant = await prisma.productVariant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductVariants and only return the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductVariantCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductVariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductVariant.
     * @param {ProductVariantDeleteArgs} args - Arguments to delete one ProductVariant.
     * @example
     * // Delete one ProductVariant
     * const ProductVariant = await prisma.productVariant.delete({
     *   where: {
     *     // ... filter to delete one ProductVariant
     *   }
     * })
     * 
     */
    delete<T extends ProductVariantDeleteArgs>(args: SelectSubset<T, ProductVariantDeleteArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductVariant.
     * @param {ProductVariantUpdateArgs} args - Arguments to update one ProductVariant.
     * @example
     * // Update one ProductVariant
     * const productVariant = await prisma.productVariant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductVariantUpdateArgs>(args: SelectSubset<T, ProductVariantUpdateArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductVariants.
     * @param {ProductVariantDeleteManyArgs} args - Arguments to filter ProductVariants to delete.
     * @example
     * // Delete a few ProductVariants
     * const { count } = await prisma.productVariant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductVariantDeleteManyArgs>(args?: SelectSubset<T, ProductVariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductVariants
     * const productVariant = await prisma.productVariant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductVariantUpdateManyArgs>(args: SelectSubset<T, ProductVariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductVariants and returns the data updated in the database.
     * @param {ProductVariantUpdateManyAndReturnArgs} args - Arguments to update many ProductVariants.
     * @example
     * // Update many ProductVariants
     * const productVariant = await prisma.productVariant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductVariants and only return the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductVariantUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductVariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductVariant.
     * @param {ProductVariantUpsertArgs} args - Arguments to update or create a ProductVariant.
     * @example
     * // Update or create a ProductVariant
     * const productVariant = await prisma.productVariant.upsert({
     *   create: {
     *     // ... data to create a ProductVariant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductVariant we want to update
     *   }
     * })
     */
    upsert<T extends ProductVariantUpsertArgs>(args: SelectSubset<T, ProductVariantUpsertArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantCountArgs} args - Arguments to filter ProductVariants to count.
     * @example
     * // Count the number of ProductVariants
     * const count = await prisma.productVariant.count({
     *   where: {
     *     // ... the filter for the ProductVariants we want to count
     *   }
     * })
    **/
    count<T extends ProductVariantCountArgs>(
      args?: Subset<T, ProductVariantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductVariantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductVariantAggregateArgs>(args: Subset<T, ProductVariantAggregateArgs>): Prisma.PrismaPromise<GetProductVariantAggregateType<T>>

    /**
     * Group by ProductVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductVariantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductVariantGroupByArgs['orderBy'] }
        : { orderBy?: ProductVariantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductVariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductVariant model
   */
  readonly fields: ProductVariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductVariant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductVariantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductVariant model
   */
  interface ProductVariantFieldRefs {
    readonly id: FieldRef<"ProductVariant", 'String'>
    readonly productId: FieldRef<"ProductVariant", 'String'>
    readonly color: FieldRef<"ProductVariant", 'String'>
    readonly fitType: FieldRef<"ProductVariant", 'FitType'>
    readonly frontImg: FieldRef<"ProductVariant", 'String'>
    readonly backImg: FieldRef<"ProductVariant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProductVariant findUnique
   */
  export type ProductVariantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant findUniqueOrThrow
   */
  export type ProductVariantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant findFirst
   */
  export type ProductVariantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductVariants.
     */
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant findFirstOrThrow
   */
  export type ProductVariantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductVariants.
     */
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant findMany
   */
  export type ProductVariantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariants to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant create
   */
  export type ProductVariantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductVariant.
     */
    data: XOR<ProductVariantCreateInput, ProductVariantUncheckedCreateInput>
  }

  /**
   * ProductVariant createMany
   */
  export type ProductVariantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductVariants.
     */
    data: ProductVariantCreateManyInput | ProductVariantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductVariant createManyAndReturn
   */
  export type ProductVariantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * The data used to create many ProductVariants.
     */
    data: ProductVariantCreateManyInput | ProductVariantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductVariant update
   */
  export type ProductVariantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductVariant.
     */
    data: XOR<ProductVariantUpdateInput, ProductVariantUncheckedUpdateInput>
    /**
     * Choose, which ProductVariant to update.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant updateMany
   */
  export type ProductVariantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductVariants.
     */
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductVariants to update
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to update.
     */
    limit?: number
  }

  /**
   * ProductVariant updateManyAndReturn
   */
  export type ProductVariantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * The data used to update ProductVariants.
     */
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductVariants to update
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductVariant upsert
   */
  export type ProductVariantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductVariant to update in case it exists.
     */
    where: ProductVariantWhereUniqueInput
    /**
     * In case the ProductVariant found by the `where` argument doesn't exist, create a new ProductVariant with this data.
     */
    create: XOR<ProductVariantCreateInput, ProductVariantUncheckedCreateInput>
    /**
     * In case the ProductVariant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductVariantUpdateInput, ProductVariantUncheckedUpdateInput>
  }

  /**
   * ProductVariant delete
   */
  export type ProductVariantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter which ProductVariant to delete.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant deleteMany
   */
  export type ProductVariantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductVariants to delete
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to delete.
     */
    limit?: number
  }

  /**
   * ProductVariant without action
   */
  export type ProductVariantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
  }


  /**
   * Model Feature
   */

  export type AggregateFeature = {
    _count: FeatureCountAggregateOutputType | null
    _min: FeatureMinAggregateOutputType | null
    _max: FeatureMaxAggregateOutputType | null
  }

  export type FeatureMinAggregateOutputType = {
    id: string | null
    productId: string | null
    content: string | null
  }

  export type FeatureMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    content: string | null
  }

  export type FeatureCountAggregateOutputType = {
    id: number
    productId: number
    content: number
    _all: number
  }


  export type FeatureMinAggregateInputType = {
    id?: true
    productId?: true
    content?: true
  }

  export type FeatureMaxAggregateInputType = {
    id?: true
    productId?: true
    content?: true
  }

  export type FeatureCountAggregateInputType = {
    id?: true
    productId?: true
    content?: true
    _all?: true
  }

  export type FeatureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feature to aggregate.
     */
    where?: FeatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Features to fetch.
     */
    orderBy?: FeatureOrderByWithRelationInput | FeatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Features from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Features.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Features
    **/
    _count?: true | FeatureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeatureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeatureMaxAggregateInputType
  }

  export type GetFeatureAggregateType<T extends FeatureAggregateArgs> = {
        [P in keyof T & keyof AggregateFeature]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeature[P]>
      : GetScalarType<T[P], AggregateFeature[P]>
  }




  export type FeatureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeatureWhereInput
    orderBy?: FeatureOrderByWithAggregationInput | FeatureOrderByWithAggregationInput[]
    by: FeatureScalarFieldEnum[] | FeatureScalarFieldEnum
    having?: FeatureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeatureCountAggregateInputType | true
    _min?: FeatureMinAggregateInputType
    _max?: FeatureMaxAggregateInputType
  }

  export type FeatureGroupByOutputType = {
    id: string
    productId: string
    content: string
    _count: FeatureCountAggregateOutputType | null
    _min: FeatureMinAggregateOutputType | null
    _max: FeatureMaxAggregateOutputType | null
  }

  type GetFeatureGroupByPayload<T extends FeatureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeatureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeatureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeatureGroupByOutputType[P]>
            : GetScalarType<T[P], FeatureGroupByOutputType[P]>
        }
      >
    >


  export type FeatureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    content?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feature"]>

  export type FeatureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    content?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feature"]>

  export type FeatureSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    content?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feature"]>

  export type FeatureSelectScalar = {
    id?: boolean
    productId?: boolean
    content?: boolean
  }

  export type FeatureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "content", ExtArgs["result"]["feature"]>
  export type FeatureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type FeatureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type FeatureIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $FeaturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feature"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      content: string
    }, ExtArgs["result"]["feature"]>
    composites: {}
  }

  type FeatureGetPayload<S extends boolean | null | undefined | FeatureDefaultArgs> = $Result.GetResult<Prisma.$FeaturePayload, S>

  type FeatureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeatureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeatureCountAggregateInputType | true
    }

  export interface FeatureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feature'], meta: { name: 'Feature' } }
    /**
     * Find zero or one Feature that matches the filter.
     * @param {FeatureFindUniqueArgs} args - Arguments to find a Feature
     * @example
     * // Get one Feature
     * const feature = await prisma.feature.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeatureFindUniqueArgs>(args: SelectSubset<T, FeatureFindUniqueArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feature that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeatureFindUniqueOrThrowArgs} args - Arguments to find a Feature
     * @example
     * // Get one Feature
     * const feature = await prisma.feature.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeatureFindUniqueOrThrowArgs>(args: SelectSubset<T, FeatureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feature that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureFindFirstArgs} args - Arguments to find a Feature
     * @example
     * // Get one Feature
     * const feature = await prisma.feature.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeatureFindFirstArgs>(args?: SelectSubset<T, FeatureFindFirstArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feature that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureFindFirstOrThrowArgs} args - Arguments to find a Feature
     * @example
     * // Get one Feature
     * const feature = await prisma.feature.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeatureFindFirstOrThrowArgs>(args?: SelectSubset<T, FeatureFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Features that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Features
     * const features = await prisma.feature.findMany()
     * 
     * // Get first 10 Features
     * const features = await prisma.feature.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const featureWithIdOnly = await prisma.feature.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeatureFindManyArgs>(args?: SelectSubset<T, FeatureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feature.
     * @param {FeatureCreateArgs} args - Arguments to create a Feature.
     * @example
     * // Create one Feature
     * const Feature = await prisma.feature.create({
     *   data: {
     *     // ... data to create a Feature
     *   }
     * })
     * 
     */
    create<T extends FeatureCreateArgs>(args: SelectSubset<T, FeatureCreateArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Features.
     * @param {FeatureCreateManyArgs} args - Arguments to create many Features.
     * @example
     * // Create many Features
     * const feature = await prisma.feature.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeatureCreateManyArgs>(args?: SelectSubset<T, FeatureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Features and returns the data saved in the database.
     * @param {FeatureCreateManyAndReturnArgs} args - Arguments to create many Features.
     * @example
     * // Create many Features
     * const feature = await prisma.feature.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Features and only return the `id`
     * const featureWithIdOnly = await prisma.feature.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeatureCreateManyAndReturnArgs>(args?: SelectSubset<T, FeatureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feature.
     * @param {FeatureDeleteArgs} args - Arguments to delete one Feature.
     * @example
     * // Delete one Feature
     * const Feature = await prisma.feature.delete({
     *   where: {
     *     // ... filter to delete one Feature
     *   }
     * })
     * 
     */
    delete<T extends FeatureDeleteArgs>(args: SelectSubset<T, FeatureDeleteArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feature.
     * @param {FeatureUpdateArgs} args - Arguments to update one Feature.
     * @example
     * // Update one Feature
     * const feature = await prisma.feature.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeatureUpdateArgs>(args: SelectSubset<T, FeatureUpdateArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Features.
     * @param {FeatureDeleteManyArgs} args - Arguments to filter Features to delete.
     * @example
     * // Delete a few Features
     * const { count } = await prisma.feature.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeatureDeleteManyArgs>(args?: SelectSubset<T, FeatureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Features.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Features
     * const feature = await prisma.feature.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeatureUpdateManyArgs>(args: SelectSubset<T, FeatureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Features and returns the data updated in the database.
     * @param {FeatureUpdateManyAndReturnArgs} args - Arguments to update many Features.
     * @example
     * // Update many Features
     * const feature = await prisma.feature.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Features and only return the `id`
     * const featureWithIdOnly = await prisma.feature.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeatureUpdateManyAndReturnArgs>(args: SelectSubset<T, FeatureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feature.
     * @param {FeatureUpsertArgs} args - Arguments to update or create a Feature.
     * @example
     * // Update or create a Feature
     * const feature = await prisma.feature.upsert({
     *   create: {
     *     // ... data to create a Feature
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feature we want to update
     *   }
     * })
     */
    upsert<T extends FeatureUpsertArgs>(args: SelectSubset<T, FeatureUpsertArgs<ExtArgs>>): Prisma__FeatureClient<$Result.GetResult<Prisma.$FeaturePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Features.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureCountArgs} args - Arguments to filter Features to count.
     * @example
     * // Count the number of Features
     * const count = await prisma.feature.count({
     *   where: {
     *     // ... the filter for the Features we want to count
     *   }
     * })
    **/
    count<T extends FeatureCountArgs>(
      args?: Subset<T, FeatureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeatureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeatureAggregateArgs>(args: Subset<T, FeatureAggregateArgs>): Prisma.PrismaPromise<GetFeatureAggregateType<T>>

    /**
     * Group by Feature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeatureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeatureGroupByArgs['orderBy'] }
        : { orderBy?: FeatureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeatureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeatureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feature model
   */
  readonly fields: FeatureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feature.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeatureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feature model
   */
  interface FeatureFieldRefs {
    readonly id: FieldRef<"Feature", 'String'>
    readonly productId: FieldRef<"Feature", 'String'>
    readonly content: FieldRef<"Feature", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Feature findUnique
   */
  export type FeatureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter, which Feature to fetch.
     */
    where: FeatureWhereUniqueInput
  }

  /**
   * Feature findUniqueOrThrow
   */
  export type FeatureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter, which Feature to fetch.
     */
    where: FeatureWhereUniqueInput
  }

  /**
   * Feature findFirst
   */
  export type FeatureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter, which Feature to fetch.
     */
    where?: FeatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Features to fetch.
     */
    orderBy?: FeatureOrderByWithRelationInput | FeatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Features.
     */
    cursor?: FeatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Features from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Features.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Features.
     */
    distinct?: FeatureScalarFieldEnum | FeatureScalarFieldEnum[]
  }

  /**
   * Feature findFirstOrThrow
   */
  export type FeatureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter, which Feature to fetch.
     */
    where?: FeatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Features to fetch.
     */
    orderBy?: FeatureOrderByWithRelationInput | FeatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Features.
     */
    cursor?: FeatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Features from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Features.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Features.
     */
    distinct?: FeatureScalarFieldEnum | FeatureScalarFieldEnum[]
  }

  /**
   * Feature findMany
   */
  export type FeatureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter, which Features to fetch.
     */
    where?: FeatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Features to fetch.
     */
    orderBy?: FeatureOrderByWithRelationInput | FeatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Features.
     */
    cursor?: FeatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Features from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Features.
     */
    skip?: number
    distinct?: FeatureScalarFieldEnum | FeatureScalarFieldEnum[]
  }

  /**
   * Feature create
   */
  export type FeatureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * The data needed to create a Feature.
     */
    data: XOR<FeatureCreateInput, FeatureUncheckedCreateInput>
  }

  /**
   * Feature createMany
   */
  export type FeatureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Features.
     */
    data: FeatureCreateManyInput | FeatureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feature createManyAndReturn
   */
  export type FeatureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * The data used to create many Features.
     */
    data: FeatureCreateManyInput | FeatureCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feature update
   */
  export type FeatureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * The data needed to update a Feature.
     */
    data: XOR<FeatureUpdateInput, FeatureUncheckedUpdateInput>
    /**
     * Choose, which Feature to update.
     */
    where: FeatureWhereUniqueInput
  }

  /**
   * Feature updateMany
   */
  export type FeatureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Features.
     */
    data: XOR<FeatureUpdateManyMutationInput, FeatureUncheckedUpdateManyInput>
    /**
     * Filter which Features to update
     */
    where?: FeatureWhereInput
    /**
     * Limit how many Features to update.
     */
    limit?: number
  }

  /**
   * Feature updateManyAndReturn
   */
  export type FeatureUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * The data used to update Features.
     */
    data: XOR<FeatureUpdateManyMutationInput, FeatureUncheckedUpdateManyInput>
    /**
     * Filter which Features to update
     */
    where?: FeatureWhereInput
    /**
     * Limit how many Features to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feature upsert
   */
  export type FeatureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * The filter to search for the Feature to update in case it exists.
     */
    where: FeatureWhereUniqueInput
    /**
     * In case the Feature found by the `where` argument doesn't exist, create a new Feature with this data.
     */
    create: XOR<FeatureCreateInput, FeatureUncheckedCreateInput>
    /**
     * In case the Feature was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeatureUpdateInput, FeatureUncheckedUpdateInput>
  }

  /**
   * Feature delete
   */
  export type FeatureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
    /**
     * Filter which Feature to delete.
     */
    where: FeatureWhereUniqueInput
  }

  /**
   * Feature deleteMany
   */
  export type FeatureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Features to delete
     */
    where?: FeatureWhereInput
    /**
     * Limit how many Features to delete.
     */
    limit?: number
  }

  /**
   * Feature without action
   */
  export type FeatureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feature
     */
    select?: FeatureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feature
     */
    omit?: FeatureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeatureInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    productId: string | null
    value: string | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    value: string | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    productId: number
    value: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    productId?: true
    value?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    productId?: true
    value?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    productId?: true
    value?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    productId: string
    value: string
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    value?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    value?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    value?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    productId?: boolean
    value?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "value", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      value: string
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly productId: FieldRef<"Tag", 'String'>
    readonly value: FieldRef<"Tag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model Mockup
   */

  export type AggregateMockup = {
    _count: MockupCountAggregateOutputType | null
    _min: MockupMinAggregateOutputType | null
    _max: MockupMaxAggregateOutputType | null
  }

  export type MockupMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MockupMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MockupCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MockupMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MockupMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MockupCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MockupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mockup to aggregate.
     */
    where?: MockupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mockups to fetch.
     */
    orderBy?: MockupOrderByWithRelationInput | MockupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MockupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mockups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mockups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Mockups
    **/
    _count?: true | MockupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MockupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MockupMaxAggregateInputType
  }

  export type GetMockupAggregateType<T extends MockupAggregateArgs> = {
        [P in keyof T & keyof AggregateMockup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMockup[P]>
      : GetScalarType<T[P], AggregateMockup[P]>
  }




  export type MockupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockupWhereInput
    orderBy?: MockupOrderByWithAggregationInput | MockupOrderByWithAggregationInput[]
    by: MockupScalarFieldEnum[] | MockupScalarFieldEnum
    having?: MockupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MockupCountAggregateInputType | true
    _min?: MockupMinAggregateInputType
    _max?: MockupMaxAggregateInputType
  }

  export type MockupGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: MockupCountAggregateOutputType | null
    _min: MockupMinAggregateOutputType | null
    _max: MockupMaxAggregateOutputType | null
  }

  type GetMockupGroupByPayload<T extends MockupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MockupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MockupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MockupGroupByOutputType[P]>
            : GetScalarType<T[P], MockupGroupByOutputType[P]>
        }
      >
    >


  export type MockupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    variants?: boolean | Mockup$variantsArgs<ExtArgs>
    Product?: boolean | Mockup$ProductArgs<ExtArgs>
    _count?: boolean | MockupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockup"]>

  export type MockupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mockup"]>

  export type MockupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mockup"]>

  export type MockupSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MockupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["mockup"]>
  export type MockupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | Mockup$variantsArgs<ExtArgs>
    Product?: boolean | Mockup$ProductArgs<ExtArgs>
    _count?: boolean | MockupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MockupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MockupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MockupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mockup"
    objects: {
      variants: Prisma.$MockupVariantPayload<ExtArgs>[]
      Product: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mockup"]>
    composites: {}
  }

  type MockupGetPayload<S extends boolean | null | undefined | MockupDefaultArgs> = $Result.GetResult<Prisma.$MockupPayload, S>

  type MockupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MockupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MockupCountAggregateInputType | true
    }

  export interface MockupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mockup'], meta: { name: 'Mockup' } }
    /**
     * Find zero or one Mockup that matches the filter.
     * @param {MockupFindUniqueArgs} args - Arguments to find a Mockup
     * @example
     * // Get one Mockup
     * const mockup = await prisma.mockup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MockupFindUniqueArgs>(args: SelectSubset<T, MockupFindUniqueArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mockup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MockupFindUniqueOrThrowArgs} args - Arguments to find a Mockup
     * @example
     * // Get one Mockup
     * const mockup = await prisma.mockup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MockupFindUniqueOrThrowArgs>(args: SelectSubset<T, MockupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mockup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupFindFirstArgs} args - Arguments to find a Mockup
     * @example
     * // Get one Mockup
     * const mockup = await prisma.mockup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MockupFindFirstArgs>(args?: SelectSubset<T, MockupFindFirstArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mockup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupFindFirstOrThrowArgs} args - Arguments to find a Mockup
     * @example
     * // Get one Mockup
     * const mockup = await prisma.mockup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MockupFindFirstOrThrowArgs>(args?: SelectSubset<T, MockupFindFirstOrThrowArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mockups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mockups
     * const mockups = await prisma.mockup.findMany()
     * 
     * // Get first 10 Mockups
     * const mockups = await prisma.mockup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mockupWithIdOnly = await prisma.mockup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MockupFindManyArgs>(args?: SelectSubset<T, MockupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mockup.
     * @param {MockupCreateArgs} args - Arguments to create a Mockup.
     * @example
     * // Create one Mockup
     * const Mockup = await prisma.mockup.create({
     *   data: {
     *     // ... data to create a Mockup
     *   }
     * })
     * 
     */
    create<T extends MockupCreateArgs>(args: SelectSubset<T, MockupCreateArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mockups.
     * @param {MockupCreateManyArgs} args - Arguments to create many Mockups.
     * @example
     * // Create many Mockups
     * const mockup = await prisma.mockup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MockupCreateManyArgs>(args?: SelectSubset<T, MockupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Mockups and returns the data saved in the database.
     * @param {MockupCreateManyAndReturnArgs} args - Arguments to create many Mockups.
     * @example
     * // Create many Mockups
     * const mockup = await prisma.mockup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Mockups and only return the `id`
     * const mockupWithIdOnly = await prisma.mockup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MockupCreateManyAndReturnArgs>(args?: SelectSubset<T, MockupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mockup.
     * @param {MockupDeleteArgs} args - Arguments to delete one Mockup.
     * @example
     * // Delete one Mockup
     * const Mockup = await prisma.mockup.delete({
     *   where: {
     *     // ... filter to delete one Mockup
     *   }
     * })
     * 
     */
    delete<T extends MockupDeleteArgs>(args: SelectSubset<T, MockupDeleteArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mockup.
     * @param {MockupUpdateArgs} args - Arguments to update one Mockup.
     * @example
     * // Update one Mockup
     * const mockup = await prisma.mockup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MockupUpdateArgs>(args: SelectSubset<T, MockupUpdateArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mockups.
     * @param {MockupDeleteManyArgs} args - Arguments to filter Mockups to delete.
     * @example
     * // Delete a few Mockups
     * const { count } = await prisma.mockup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MockupDeleteManyArgs>(args?: SelectSubset<T, MockupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mockups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mockups
     * const mockup = await prisma.mockup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MockupUpdateManyArgs>(args: SelectSubset<T, MockupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mockups and returns the data updated in the database.
     * @param {MockupUpdateManyAndReturnArgs} args - Arguments to update many Mockups.
     * @example
     * // Update many Mockups
     * const mockup = await prisma.mockup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Mockups and only return the `id`
     * const mockupWithIdOnly = await prisma.mockup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MockupUpdateManyAndReturnArgs>(args: SelectSubset<T, MockupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mockup.
     * @param {MockupUpsertArgs} args - Arguments to update or create a Mockup.
     * @example
     * // Update or create a Mockup
     * const mockup = await prisma.mockup.upsert({
     *   create: {
     *     // ... data to create a Mockup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mockup we want to update
     *   }
     * })
     */
    upsert<T extends MockupUpsertArgs>(args: SelectSubset<T, MockupUpsertArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mockups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupCountArgs} args - Arguments to filter Mockups to count.
     * @example
     * // Count the number of Mockups
     * const count = await prisma.mockup.count({
     *   where: {
     *     // ... the filter for the Mockups we want to count
     *   }
     * })
    **/
    count<T extends MockupCountArgs>(
      args?: Subset<T, MockupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MockupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mockup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MockupAggregateArgs>(args: Subset<T, MockupAggregateArgs>): Prisma.PrismaPromise<GetMockupAggregateType<T>>

    /**
     * Group by Mockup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MockupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MockupGroupByArgs['orderBy'] }
        : { orderBy?: MockupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MockupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMockupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mockup model
   */
  readonly fields: MockupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mockup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MockupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    variants<T extends Mockup$variantsArgs<ExtArgs> = {}>(args?: Subset<T, Mockup$variantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Product<T extends Mockup$ProductArgs<ExtArgs> = {}>(args?: Subset<T, Mockup$ProductArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Mockup model
   */
  interface MockupFieldRefs {
    readonly id: FieldRef<"Mockup", 'String'>
    readonly name: FieldRef<"Mockup", 'String'>
    readonly createdAt: FieldRef<"Mockup", 'DateTime'>
    readonly updatedAt: FieldRef<"Mockup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Mockup findUnique
   */
  export type MockupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter, which Mockup to fetch.
     */
    where: MockupWhereUniqueInput
  }

  /**
   * Mockup findUniqueOrThrow
   */
  export type MockupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter, which Mockup to fetch.
     */
    where: MockupWhereUniqueInput
  }

  /**
   * Mockup findFirst
   */
  export type MockupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter, which Mockup to fetch.
     */
    where?: MockupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mockups to fetch.
     */
    orderBy?: MockupOrderByWithRelationInput | MockupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mockups.
     */
    cursor?: MockupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mockups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mockups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mockups.
     */
    distinct?: MockupScalarFieldEnum | MockupScalarFieldEnum[]
  }

  /**
   * Mockup findFirstOrThrow
   */
  export type MockupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter, which Mockup to fetch.
     */
    where?: MockupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mockups to fetch.
     */
    orderBy?: MockupOrderByWithRelationInput | MockupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mockups.
     */
    cursor?: MockupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mockups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mockups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mockups.
     */
    distinct?: MockupScalarFieldEnum | MockupScalarFieldEnum[]
  }

  /**
   * Mockup findMany
   */
  export type MockupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter, which Mockups to fetch.
     */
    where?: MockupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mockups to fetch.
     */
    orderBy?: MockupOrderByWithRelationInput | MockupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Mockups.
     */
    cursor?: MockupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mockups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mockups.
     */
    skip?: number
    distinct?: MockupScalarFieldEnum | MockupScalarFieldEnum[]
  }

  /**
   * Mockup create
   */
  export type MockupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * The data needed to create a Mockup.
     */
    data: XOR<MockupCreateInput, MockupUncheckedCreateInput>
  }

  /**
   * Mockup createMany
   */
  export type MockupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Mockups.
     */
    data: MockupCreateManyInput | MockupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mockup createManyAndReturn
   */
  export type MockupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * The data used to create many Mockups.
     */
    data: MockupCreateManyInput | MockupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mockup update
   */
  export type MockupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * The data needed to update a Mockup.
     */
    data: XOR<MockupUpdateInput, MockupUncheckedUpdateInput>
    /**
     * Choose, which Mockup to update.
     */
    where: MockupWhereUniqueInput
  }

  /**
   * Mockup updateMany
   */
  export type MockupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Mockups.
     */
    data: XOR<MockupUpdateManyMutationInput, MockupUncheckedUpdateManyInput>
    /**
     * Filter which Mockups to update
     */
    where?: MockupWhereInput
    /**
     * Limit how many Mockups to update.
     */
    limit?: number
  }

  /**
   * Mockup updateManyAndReturn
   */
  export type MockupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * The data used to update Mockups.
     */
    data: XOR<MockupUpdateManyMutationInput, MockupUncheckedUpdateManyInput>
    /**
     * Filter which Mockups to update
     */
    where?: MockupWhereInput
    /**
     * Limit how many Mockups to update.
     */
    limit?: number
  }

  /**
   * Mockup upsert
   */
  export type MockupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * The filter to search for the Mockup to update in case it exists.
     */
    where: MockupWhereUniqueInput
    /**
     * In case the Mockup found by the `where` argument doesn't exist, create a new Mockup with this data.
     */
    create: XOR<MockupCreateInput, MockupUncheckedCreateInput>
    /**
     * In case the Mockup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MockupUpdateInput, MockupUncheckedUpdateInput>
  }

  /**
   * Mockup delete
   */
  export type MockupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
    /**
     * Filter which Mockup to delete.
     */
    where: MockupWhereUniqueInput
  }

  /**
   * Mockup deleteMany
   */
  export type MockupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mockups to delete
     */
    where?: MockupWhereInput
    /**
     * Limit how many Mockups to delete.
     */
    limit?: number
  }

  /**
   * Mockup.variants
   */
  export type Mockup$variantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    where?: MockupVariantWhereInput
    orderBy?: MockupVariantOrderByWithRelationInput | MockupVariantOrderByWithRelationInput[]
    cursor?: MockupVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MockupVariantScalarFieldEnum | MockupVariantScalarFieldEnum[]
  }

  /**
   * Mockup.Product
   */
  export type Mockup$ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Mockup without action
   */
  export type MockupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mockup
     */
    select?: MockupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mockup
     */
    omit?: MockupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupInclude<ExtArgs> | null
  }


  /**
   * Model MockupVariant
   */

  export type AggregateMockupVariant = {
    _count: MockupVariantCountAggregateOutputType | null
    _min: MockupVariantMinAggregateOutputType | null
    _max: MockupVariantMaxAggregateOutputType | null
  }

  export type MockupVariantMinAggregateOutputType = {
    id: string | null
    mockupId: string | null
    color: string | null
    fitType: $Enums.FitType | null
    frontImg: string | null
    backImg: string | null
  }

  export type MockupVariantMaxAggregateOutputType = {
    id: string | null
    mockupId: string | null
    color: string | null
    fitType: $Enums.FitType | null
    frontImg: string | null
    backImg: string | null
  }

  export type MockupVariantCountAggregateOutputType = {
    id: number
    mockupId: number
    color: number
    fitType: number
    frontImg: number
    backImg: number
    _all: number
  }


  export type MockupVariantMinAggregateInputType = {
    id?: true
    mockupId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
  }

  export type MockupVariantMaxAggregateInputType = {
    id?: true
    mockupId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
  }

  export type MockupVariantCountAggregateInputType = {
    id?: true
    mockupId?: true
    color?: true
    fitType?: true
    frontImg?: true
    backImg?: true
    _all?: true
  }

  export type MockupVariantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MockupVariant to aggregate.
     */
    where?: MockupVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockupVariants to fetch.
     */
    orderBy?: MockupVariantOrderByWithRelationInput | MockupVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MockupVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockupVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockupVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MockupVariants
    **/
    _count?: true | MockupVariantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MockupVariantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MockupVariantMaxAggregateInputType
  }

  export type GetMockupVariantAggregateType<T extends MockupVariantAggregateArgs> = {
        [P in keyof T & keyof AggregateMockupVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMockupVariant[P]>
      : GetScalarType<T[P], AggregateMockupVariant[P]>
  }




  export type MockupVariantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockupVariantWhereInput
    orderBy?: MockupVariantOrderByWithAggregationInput | MockupVariantOrderByWithAggregationInput[]
    by: MockupVariantScalarFieldEnum[] | MockupVariantScalarFieldEnum
    having?: MockupVariantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MockupVariantCountAggregateInputType | true
    _min?: MockupVariantMinAggregateInputType
    _max?: MockupVariantMaxAggregateInputType
  }

  export type MockupVariantGroupByOutputType = {
    id: string
    mockupId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
    _count: MockupVariantCountAggregateOutputType | null
    _min: MockupVariantMinAggregateOutputType | null
    _max: MockupVariantMaxAggregateOutputType | null
  }

  type GetMockupVariantGroupByPayload<T extends MockupVariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MockupVariantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MockupVariantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MockupVariantGroupByOutputType[P]>
            : GetScalarType<T[P], MockupVariantGroupByOutputType[P]>
        }
      >
    >


  export type MockupVariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mockupId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockupVariant"]>

  export type MockupVariantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mockupId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockupVariant"]>

  export type MockupVariantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mockupId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockupVariant"]>

  export type MockupVariantSelectScalar = {
    id?: boolean
    mockupId?: boolean
    color?: boolean
    fitType?: boolean
    frontImg?: boolean
    backImg?: boolean
  }

  export type MockupVariantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mockupId" | "color" | "fitType" | "frontImg" | "backImg", ExtArgs["result"]["mockupVariant"]>
  export type MockupVariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }
  export type MockupVariantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }
  export type MockupVariantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mockup?: boolean | MockupDefaultArgs<ExtArgs>
  }

  export type $MockupVariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MockupVariant"
    objects: {
      mockup: Prisma.$MockupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mockupId: string
      color: string
      fitType: $Enums.FitType
      frontImg: string
      backImg: string
    }, ExtArgs["result"]["mockupVariant"]>
    composites: {}
  }

  type MockupVariantGetPayload<S extends boolean | null | undefined | MockupVariantDefaultArgs> = $Result.GetResult<Prisma.$MockupVariantPayload, S>

  type MockupVariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MockupVariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MockupVariantCountAggregateInputType | true
    }

  export interface MockupVariantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MockupVariant'], meta: { name: 'MockupVariant' } }
    /**
     * Find zero or one MockupVariant that matches the filter.
     * @param {MockupVariantFindUniqueArgs} args - Arguments to find a MockupVariant
     * @example
     * // Get one MockupVariant
     * const mockupVariant = await prisma.mockupVariant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MockupVariantFindUniqueArgs>(args: SelectSubset<T, MockupVariantFindUniqueArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MockupVariant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MockupVariantFindUniqueOrThrowArgs} args - Arguments to find a MockupVariant
     * @example
     * // Get one MockupVariant
     * const mockupVariant = await prisma.mockupVariant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MockupVariantFindUniqueOrThrowArgs>(args: SelectSubset<T, MockupVariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MockupVariant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantFindFirstArgs} args - Arguments to find a MockupVariant
     * @example
     * // Get one MockupVariant
     * const mockupVariant = await prisma.mockupVariant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MockupVariantFindFirstArgs>(args?: SelectSubset<T, MockupVariantFindFirstArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MockupVariant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantFindFirstOrThrowArgs} args - Arguments to find a MockupVariant
     * @example
     * // Get one MockupVariant
     * const mockupVariant = await prisma.mockupVariant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MockupVariantFindFirstOrThrowArgs>(args?: SelectSubset<T, MockupVariantFindFirstOrThrowArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MockupVariants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MockupVariants
     * const mockupVariants = await prisma.mockupVariant.findMany()
     * 
     * // Get first 10 MockupVariants
     * const mockupVariants = await prisma.mockupVariant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mockupVariantWithIdOnly = await prisma.mockupVariant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MockupVariantFindManyArgs>(args?: SelectSubset<T, MockupVariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MockupVariant.
     * @param {MockupVariantCreateArgs} args - Arguments to create a MockupVariant.
     * @example
     * // Create one MockupVariant
     * const MockupVariant = await prisma.mockupVariant.create({
     *   data: {
     *     // ... data to create a MockupVariant
     *   }
     * })
     * 
     */
    create<T extends MockupVariantCreateArgs>(args: SelectSubset<T, MockupVariantCreateArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MockupVariants.
     * @param {MockupVariantCreateManyArgs} args - Arguments to create many MockupVariants.
     * @example
     * // Create many MockupVariants
     * const mockupVariant = await prisma.mockupVariant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MockupVariantCreateManyArgs>(args?: SelectSubset<T, MockupVariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MockupVariants and returns the data saved in the database.
     * @param {MockupVariantCreateManyAndReturnArgs} args - Arguments to create many MockupVariants.
     * @example
     * // Create many MockupVariants
     * const mockupVariant = await prisma.mockupVariant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MockupVariants and only return the `id`
     * const mockupVariantWithIdOnly = await prisma.mockupVariant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MockupVariantCreateManyAndReturnArgs>(args?: SelectSubset<T, MockupVariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MockupVariant.
     * @param {MockupVariantDeleteArgs} args - Arguments to delete one MockupVariant.
     * @example
     * // Delete one MockupVariant
     * const MockupVariant = await prisma.mockupVariant.delete({
     *   where: {
     *     // ... filter to delete one MockupVariant
     *   }
     * })
     * 
     */
    delete<T extends MockupVariantDeleteArgs>(args: SelectSubset<T, MockupVariantDeleteArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MockupVariant.
     * @param {MockupVariantUpdateArgs} args - Arguments to update one MockupVariant.
     * @example
     * // Update one MockupVariant
     * const mockupVariant = await prisma.mockupVariant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MockupVariantUpdateArgs>(args: SelectSubset<T, MockupVariantUpdateArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MockupVariants.
     * @param {MockupVariantDeleteManyArgs} args - Arguments to filter MockupVariants to delete.
     * @example
     * // Delete a few MockupVariants
     * const { count } = await prisma.mockupVariant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MockupVariantDeleteManyArgs>(args?: SelectSubset<T, MockupVariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MockupVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MockupVariants
     * const mockupVariant = await prisma.mockupVariant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MockupVariantUpdateManyArgs>(args: SelectSubset<T, MockupVariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MockupVariants and returns the data updated in the database.
     * @param {MockupVariantUpdateManyAndReturnArgs} args - Arguments to update many MockupVariants.
     * @example
     * // Update many MockupVariants
     * const mockupVariant = await prisma.mockupVariant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MockupVariants and only return the `id`
     * const mockupVariantWithIdOnly = await prisma.mockupVariant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MockupVariantUpdateManyAndReturnArgs>(args: SelectSubset<T, MockupVariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MockupVariant.
     * @param {MockupVariantUpsertArgs} args - Arguments to update or create a MockupVariant.
     * @example
     * // Update or create a MockupVariant
     * const mockupVariant = await prisma.mockupVariant.upsert({
     *   create: {
     *     // ... data to create a MockupVariant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MockupVariant we want to update
     *   }
     * })
     */
    upsert<T extends MockupVariantUpsertArgs>(args: SelectSubset<T, MockupVariantUpsertArgs<ExtArgs>>): Prisma__MockupVariantClient<$Result.GetResult<Prisma.$MockupVariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MockupVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantCountArgs} args - Arguments to filter MockupVariants to count.
     * @example
     * // Count the number of MockupVariants
     * const count = await prisma.mockupVariant.count({
     *   where: {
     *     // ... the filter for the MockupVariants we want to count
     *   }
     * })
    **/
    count<T extends MockupVariantCountArgs>(
      args?: Subset<T, MockupVariantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MockupVariantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MockupVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MockupVariantAggregateArgs>(args: Subset<T, MockupVariantAggregateArgs>): Prisma.PrismaPromise<GetMockupVariantAggregateType<T>>

    /**
     * Group by MockupVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockupVariantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MockupVariantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MockupVariantGroupByArgs['orderBy'] }
        : { orderBy?: MockupVariantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MockupVariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMockupVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MockupVariant model
   */
  readonly fields: MockupVariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MockupVariant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MockupVariantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mockup<T extends MockupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MockupDefaultArgs<ExtArgs>>): Prisma__MockupClient<$Result.GetResult<Prisma.$MockupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MockupVariant model
   */
  interface MockupVariantFieldRefs {
    readonly id: FieldRef<"MockupVariant", 'String'>
    readonly mockupId: FieldRef<"MockupVariant", 'String'>
    readonly color: FieldRef<"MockupVariant", 'String'>
    readonly fitType: FieldRef<"MockupVariant", 'FitType'>
    readonly frontImg: FieldRef<"MockupVariant", 'String'>
    readonly backImg: FieldRef<"MockupVariant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MockupVariant findUnique
   */
  export type MockupVariantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter, which MockupVariant to fetch.
     */
    where: MockupVariantWhereUniqueInput
  }

  /**
   * MockupVariant findUniqueOrThrow
   */
  export type MockupVariantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter, which MockupVariant to fetch.
     */
    where: MockupVariantWhereUniqueInput
  }

  /**
   * MockupVariant findFirst
   */
  export type MockupVariantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter, which MockupVariant to fetch.
     */
    where?: MockupVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockupVariants to fetch.
     */
    orderBy?: MockupVariantOrderByWithRelationInput | MockupVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MockupVariants.
     */
    cursor?: MockupVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockupVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockupVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MockupVariants.
     */
    distinct?: MockupVariantScalarFieldEnum | MockupVariantScalarFieldEnum[]
  }

  /**
   * MockupVariant findFirstOrThrow
   */
  export type MockupVariantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter, which MockupVariant to fetch.
     */
    where?: MockupVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockupVariants to fetch.
     */
    orderBy?: MockupVariantOrderByWithRelationInput | MockupVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MockupVariants.
     */
    cursor?: MockupVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockupVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockupVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MockupVariants.
     */
    distinct?: MockupVariantScalarFieldEnum | MockupVariantScalarFieldEnum[]
  }

  /**
   * MockupVariant findMany
   */
  export type MockupVariantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter, which MockupVariants to fetch.
     */
    where?: MockupVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockupVariants to fetch.
     */
    orderBy?: MockupVariantOrderByWithRelationInput | MockupVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MockupVariants.
     */
    cursor?: MockupVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockupVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockupVariants.
     */
    skip?: number
    distinct?: MockupVariantScalarFieldEnum | MockupVariantScalarFieldEnum[]
  }

  /**
   * MockupVariant create
   */
  export type MockupVariantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * The data needed to create a MockupVariant.
     */
    data: XOR<MockupVariantCreateInput, MockupVariantUncheckedCreateInput>
  }

  /**
   * MockupVariant createMany
   */
  export type MockupVariantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MockupVariants.
     */
    data: MockupVariantCreateManyInput | MockupVariantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MockupVariant createManyAndReturn
   */
  export type MockupVariantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * The data used to create many MockupVariants.
     */
    data: MockupVariantCreateManyInput | MockupVariantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MockupVariant update
   */
  export type MockupVariantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * The data needed to update a MockupVariant.
     */
    data: XOR<MockupVariantUpdateInput, MockupVariantUncheckedUpdateInput>
    /**
     * Choose, which MockupVariant to update.
     */
    where: MockupVariantWhereUniqueInput
  }

  /**
   * MockupVariant updateMany
   */
  export type MockupVariantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MockupVariants.
     */
    data: XOR<MockupVariantUpdateManyMutationInput, MockupVariantUncheckedUpdateManyInput>
    /**
     * Filter which MockupVariants to update
     */
    where?: MockupVariantWhereInput
    /**
     * Limit how many MockupVariants to update.
     */
    limit?: number
  }

  /**
   * MockupVariant updateManyAndReturn
   */
  export type MockupVariantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * The data used to update MockupVariants.
     */
    data: XOR<MockupVariantUpdateManyMutationInput, MockupVariantUncheckedUpdateManyInput>
    /**
     * Filter which MockupVariants to update
     */
    where?: MockupVariantWhereInput
    /**
     * Limit how many MockupVariants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MockupVariant upsert
   */
  export type MockupVariantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * The filter to search for the MockupVariant to update in case it exists.
     */
    where: MockupVariantWhereUniqueInput
    /**
     * In case the MockupVariant found by the `where` argument doesn't exist, create a new MockupVariant with this data.
     */
    create: XOR<MockupVariantCreateInput, MockupVariantUncheckedCreateInput>
    /**
     * In case the MockupVariant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MockupVariantUpdateInput, MockupVariantUncheckedUpdateInput>
  }

  /**
   * MockupVariant delete
   */
  export type MockupVariantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
    /**
     * Filter which MockupVariant to delete.
     */
    where: MockupVariantWhereUniqueInput
  }

  /**
   * MockupVariant deleteMany
   */
  export type MockupVariantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MockupVariants to delete
     */
    where?: MockupVariantWhereInput
    /**
     * Limit how many MockupVariants to delete.
     */
    limit?: number
  }

  /**
   * MockupVariant without action
   */
  export type MockupVariantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockupVariant
     */
    select?: MockupVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockupVariant
     */
    omit?: MockupVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockupVariantInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    name: 'name',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isActive: 'isActive'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MerchantProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fullName: 'fullName',
    dateOfBirth: 'dateOfBirth',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    nidOrPassportNo: 'nidOrPassportNo',
    presentAddress: 'presentAddress',
    permanentAddress: 'permanentAddress',
    portfolioUrl: 'portfolioUrl',
    websiteUrl: 'websiteUrl',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    accountName: 'accountName',
    accountNumber: 'accountNumber',
    routingNumber: 'routingNumber',
    message: 'message',
    tiar: 'tiar',
    brandOption: 'brandOption',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MerchantProfileScalarFieldEnum = (typeof MerchantProfileScalarFieldEnum)[keyof typeof MerchantProfileScalarFieldEnum]


  export const BrandScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    brandCategoryId: 'brandCategoryId',
    userId: 'userId',
    defaultBrandPct: 'defaultBrandPct',
    defaultMerchantPct: 'defaultMerchantPct'
  };

  export type BrandScalarFieldEnum = (typeof BrandScalarFieldEnum)[keyof typeof BrandScalarFieldEnum]


  export const BrandCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BrandCategoryScalarFieldEnum = (typeof BrandCategoryScalarFieldEnum)[keyof typeof BrandCategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    title: 'title',
    description: 'description',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isActive: 'isActive',
    brandName: 'brandName',
    brandId: 'brandId',
    mockupId: 'mockupId',
    userId: 'userId',
    visibility: 'visibility',
    backDesign: 'backDesign',
    frontDesign: 'frontDesign',
    brandCommissionPct: 'brandCommissionPct',
    merchantCommissionPct: 'merchantCommissionPct'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const SaleScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    merchantId: 'merchantId',
    brandId: 'brandId',
    quantity: 'quantity',
    total: 'total',
    brandEarning: 'brandEarning',
    merchantEarning: 'merchantEarning',
    platformEarning: 'platformEarning',
    createdAt: 'createdAt'
  };

  export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum]


  export const ProductVariantScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    color: 'color',
    fitType: 'fitType',
    frontImg: 'frontImg',
    backImg: 'backImg'
  };

  export type ProductVariantScalarFieldEnum = (typeof ProductVariantScalarFieldEnum)[keyof typeof ProductVariantScalarFieldEnum]


  export const FeatureScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    content: 'content'
  };

  export type FeatureScalarFieldEnum = (typeof FeatureScalarFieldEnum)[keyof typeof FeatureScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    value: 'value'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const MockupScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MockupScalarFieldEnum = (typeof MockupScalarFieldEnum)[keyof typeof MockupScalarFieldEnum]


  export const MockupVariantScalarFieldEnum: {
    id: 'id',
    mockupId: 'mockupId',
    color: 'color',
    fitType: 'fitType',
    frontImg: 'frontImg',
    backImg: 'backImg'
  };

  export type MockupVariantScalarFieldEnum = (typeof MockupVariantScalarFieldEnum)[keyof typeof MockupVariantScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'FitType'
   */
  export type EnumFitTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FitType'>
    


  /**
   * Reference to a field of type 'FitType[]'
   */
  export type ListEnumFitTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FitType[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isActive?: BoolFilter<"User"> | boolean
    brands?: BrandListRelationFilter
    products?: ProductListRelationFilter
    sales?: SaleListRelationFilter
    merchantProfile?: XOR<MerchantProfileNullableScalarRelationFilter, MerchantProfileWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brands?: BrandOrderByRelationAggregateInput
    products?: ProductOrderByRelationAggregateInput
    sales?: SaleOrderByRelationAggregateInput
    merchantProfile?: MerchantProfileOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isActive?: BoolFilter<"User"> | boolean
    brands?: BrandListRelationFilter
    products?: ProductListRelationFilter
    sales?: SaleListRelationFilter
    merchantProfile?: XOR<MerchantProfileNullableScalarRelationFilter, MerchantProfileWhereInput> | null
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type MerchantProfileWhereInput = {
    AND?: MerchantProfileWhereInput | MerchantProfileWhereInput[]
    OR?: MerchantProfileWhereInput[]
    NOT?: MerchantProfileWhereInput | MerchantProfileWhereInput[]
    id?: StringFilter<"MerchantProfile"> | string
    userId?: StringFilter<"MerchantProfile"> | string
    fullName?: StringFilter<"MerchantProfile"> | string
    dateOfBirth?: DateTimeFilter<"MerchantProfile"> | Date | string
    contactEmail?: StringFilter<"MerchantProfile"> | string
    contactPhone?: StringFilter<"MerchantProfile"> | string
    nidOrPassportNo?: StringFilter<"MerchantProfile"> | string
    presentAddress?: StringFilter<"MerchantProfile"> | string
    permanentAddress?: StringFilter<"MerchantProfile"> | string
    portfolioUrl?: StringNullableFilter<"MerchantProfile"> | string | null
    websiteUrl?: StringNullableFilter<"MerchantProfile"> | string | null
    bankName?: StringFilter<"MerchantProfile"> | string
    bankBranch?: StringFilter<"MerchantProfile"> | string
    accountName?: StringFilter<"MerchantProfile"> | string
    accountNumber?: StringFilter<"MerchantProfile"> | string
    routingNumber?: StringFilter<"MerchantProfile"> | string
    message?: StringNullableFilter<"MerchantProfile"> | string | null
    tiar?: IntFilter<"MerchantProfile"> | number
    brandOption?: BoolFilter<"MerchantProfile"> | boolean
    createdAt?: DateTimeFilter<"MerchantProfile"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MerchantProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    nidOrPassportNo?: SortOrder
    presentAddress?: SortOrder
    permanentAddress?: SortOrder
    portfolioUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    accountName?: SortOrder
    accountNumber?: SortOrder
    routingNumber?: SortOrder
    message?: SortOrderInput | SortOrder
    tiar?: SortOrder
    brandOption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MerchantProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: MerchantProfileWhereInput | MerchantProfileWhereInput[]
    OR?: MerchantProfileWhereInput[]
    NOT?: MerchantProfileWhereInput | MerchantProfileWhereInput[]
    fullName?: StringFilter<"MerchantProfile"> | string
    dateOfBirth?: DateTimeFilter<"MerchantProfile"> | Date | string
    contactEmail?: StringFilter<"MerchantProfile"> | string
    contactPhone?: StringFilter<"MerchantProfile"> | string
    nidOrPassportNo?: StringFilter<"MerchantProfile"> | string
    presentAddress?: StringFilter<"MerchantProfile"> | string
    permanentAddress?: StringFilter<"MerchantProfile"> | string
    portfolioUrl?: StringNullableFilter<"MerchantProfile"> | string | null
    websiteUrl?: StringNullableFilter<"MerchantProfile"> | string | null
    bankName?: StringFilter<"MerchantProfile"> | string
    bankBranch?: StringFilter<"MerchantProfile"> | string
    accountName?: StringFilter<"MerchantProfile"> | string
    accountNumber?: StringFilter<"MerchantProfile"> | string
    routingNumber?: StringFilter<"MerchantProfile"> | string
    message?: StringNullableFilter<"MerchantProfile"> | string | null
    tiar?: IntFilter<"MerchantProfile"> | number
    brandOption?: BoolFilter<"MerchantProfile"> | boolean
    createdAt?: DateTimeFilter<"MerchantProfile"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type MerchantProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    nidOrPassportNo?: SortOrder
    presentAddress?: SortOrder
    permanentAddress?: SortOrder
    portfolioUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    accountName?: SortOrder
    accountNumber?: SortOrder
    routingNumber?: SortOrder
    message?: SortOrderInput | SortOrder
    tiar?: SortOrder
    brandOption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MerchantProfileCountOrderByAggregateInput
    _avg?: MerchantProfileAvgOrderByAggregateInput
    _max?: MerchantProfileMaxOrderByAggregateInput
    _min?: MerchantProfileMinOrderByAggregateInput
    _sum?: MerchantProfileSumOrderByAggregateInput
  }

  export type MerchantProfileScalarWhereWithAggregatesInput = {
    AND?: MerchantProfileScalarWhereWithAggregatesInput | MerchantProfileScalarWhereWithAggregatesInput[]
    OR?: MerchantProfileScalarWhereWithAggregatesInput[]
    NOT?: MerchantProfileScalarWhereWithAggregatesInput | MerchantProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MerchantProfile"> | string
    userId?: StringWithAggregatesFilter<"MerchantProfile"> | string
    fullName?: StringWithAggregatesFilter<"MerchantProfile"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"MerchantProfile"> | Date | string
    contactEmail?: StringWithAggregatesFilter<"MerchantProfile"> | string
    contactPhone?: StringWithAggregatesFilter<"MerchantProfile"> | string
    nidOrPassportNo?: StringWithAggregatesFilter<"MerchantProfile"> | string
    presentAddress?: StringWithAggregatesFilter<"MerchantProfile"> | string
    permanentAddress?: StringWithAggregatesFilter<"MerchantProfile"> | string
    portfolioUrl?: StringNullableWithAggregatesFilter<"MerchantProfile"> | string | null
    websiteUrl?: StringNullableWithAggregatesFilter<"MerchantProfile"> | string | null
    bankName?: StringWithAggregatesFilter<"MerchantProfile"> | string
    bankBranch?: StringWithAggregatesFilter<"MerchantProfile"> | string
    accountName?: StringWithAggregatesFilter<"MerchantProfile"> | string
    accountNumber?: StringWithAggregatesFilter<"MerchantProfile"> | string
    routingNumber?: StringWithAggregatesFilter<"MerchantProfile"> | string
    message?: StringNullableWithAggregatesFilter<"MerchantProfile"> | string | null
    tiar?: IntWithAggregatesFilter<"MerchantProfile"> | number
    brandOption?: BoolWithAggregatesFilter<"MerchantProfile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"MerchantProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MerchantProfile"> | Date | string
  }

  export type BrandWhereInput = {
    AND?: BrandWhereInput | BrandWhereInput[]
    OR?: BrandWhereInput[]
    NOT?: BrandWhereInput | BrandWhereInput[]
    id?: StringFilter<"Brand"> | string
    name?: StringFilter<"Brand"> | string
    isActive?: BoolFilter<"Brand"> | boolean
    createdAt?: DateTimeFilter<"Brand"> | Date | string
    updatedAt?: DateTimeFilter<"Brand"> | Date | string
    brandCategoryId?: StringFilter<"Brand"> | string
    userId?: StringFilter<"Brand"> | string
    defaultBrandPct?: FloatFilter<"Brand"> | number
    defaultMerchantPct?: FloatFilter<"Brand"> | number
    brandCategory?: XOR<BrandCategoryScalarRelationFilter, BrandCategoryWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    Product?: ProductListRelationFilter
    Sales?: SaleListRelationFilter
  }

  export type BrandOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brandCategoryId?: SortOrder
    userId?: SortOrder
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
    brandCategory?: BrandCategoryOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    Product?: ProductOrderByRelationAggregateInput
    Sales?: SaleOrderByRelationAggregateInput
  }

  export type BrandWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BrandWhereInput | BrandWhereInput[]
    OR?: BrandWhereInput[]
    NOT?: BrandWhereInput | BrandWhereInput[]
    name?: StringFilter<"Brand"> | string
    isActive?: BoolFilter<"Brand"> | boolean
    createdAt?: DateTimeFilter<"Brand"> | Date | string
    updatedAt?: DateTimeFilter<"Brand"> | Date | string
    brandCategoryId?: StringFilter<"Brand"> | string
    userId?: StringFilter<"Brand"> | string
    defaultBrandPct?: FloatFilter<"Brand"> | number
    defaultMerchantPct?: FloatFilter<"Brand"> | number
    brandCategory?: XOR<BrandCategoryScalarRelationFilter, BrandCategoryWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    Product?: ProductListRelationFilter
    Sales?: SaleListRelationFilter
  }, "id">

  export type BrandOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brandCategoryId?: SortOrder
    userId?: SortOrder
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
    _count?: BrandCountOrderByAggregateInput
    _avg?: BrandAvgOrderByAggregateInput
    _max?: BrandMaxOrderByAggregateInput
    _min?: BrandMinOrderByAggregateInput
    _sum?: BrandSumOrderByAggregateInput
  }

  export type BrandScalarWhereWithAggregatesInput = {
    AND?: BrandScalarWhereWithAggregatesInput | BrandScalarWhereWithAggregatesInput[]
    OR?: BrandScalarWhereWithAggregatesInput[]
    NOT?: BrandScalarWhereWithAggregatesInput | BrandScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Brand"> | string
    name?: StringWithAggregatesFilter<"Brand"> | string
    isActive?: BoolWithAggregatesFilter<"Brand"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Brand"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Brand"> | Date | string
    brandCategoryId?: StringWithAggregatesFilter<"Brand"> | string
    userId?: StringWithAggregatesFilter<"Brand"> | string
    defaultBrandPct?: FloatWithAggregatesFilter<"Brand"> | number
    defaultMerchantPct?: FloatWithAggregatesFilter<"Brand"> | number
  }

  export type BrandCategoryWhereInput = {
    AND?: BrandCategoryWhereInput | BrandCategoryWhereInput[]
    OR?: BrandCategoryWhereInput[]
    NOT?: BrandCategoryWhereInput | BrandCategoryWhereInput[]
    id?: StringFilter<"BrandCategory"> | string
    name?: StringFilter<"BrandCategory"> | string
    createdAt?: DateTimeFilter<"BrandCategory"> | Date | string
    updatedAt?: DateTimeFilter<"BrandCategory"> | Date | string
    Brand?: BrandListRelationFilter
  }

  export type BrandCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Brand?: BrandOrderByRelationAggregateInput
  }

  export type BrandCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BrandCategoryWhereInput | BrandCategoryWhereInput[]
    OR?: BrandCategoryWhereInput[]
    NOT?: BrandCategoryWhereInput | BrandCategoryWhereInput[]
    name?: StringFilter<"BrandCategory"> | string
    createdAt?: DateTimeFilter<"BrandCategory"> | Date | string
    updatedAt?: DateTimeFilter<"BrandCategory"> | Date | string
    Brand?: BrandListRelationFilter
  }, "id">

  export type BrandCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BrandCategoryCountOrderByAggregateInput
    _max?: BrandCategoryMaxOrderByAggregateInput
    _min?: BrandCategoryMinOrderByAggregateInput
  }

  export type BrandCategoryScalarWhereWithAggregatesInput = {
    AND?: BrandCategoryScalarWhereWithAggregatesInput | BrandCategoryScalarWhereWithAggregatesInput[]
    OR?: BrandCategoryScalarWhereWithAggregatesInput[]
    NOT?: BrandCategoryScalarWhereWithAggregatesInput | BrandCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BrandCategory"> | string
    name?: StringWithAggregatesFilter<"BrandCategory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BrandCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BrandCategory"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    productId?: StringFilter<"Product"> | string
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    isActive?: BoolFilter<"Product"> | boolean
    brandName?: StringNullableFilter<"Product"> | string | null
    brandId?: StringNullableFilter<"Product"> | string | null
    mockupId?: StringFilter<"Product"> | string
    userId?: StringFilter<"Product"> | string
    visibility?: BoolFilter<"Product"> | boolean
    backDesign?: StringNullableFilter<"Product"> | string | null
    frontDesign?: StringFilter<"Product"> | string
    brandCommissionPct?: FloatNullableFilter<"Product"> | number | null
    merchantCommissionPct?: FloatNullableFilter<"Product"> | number | null
    Brand?: XOR<BrandNullableScalarRelationFilter, BrandWhereInput> | null
    features?: FeatureListRelationFilter
    tags?: TagListRelationFilter
    Mockup?: XOR<MockupScalarRelationFilter, MockupWhereInput>
    variants?: ProductVariantListRelationFilter
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
    sales?: SaleListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brandName?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    mockupId?: SortOrder
    userId?: SortOrder
    visibility?: SortOrder
    backDesign?: SortOrderInput | SortOrder
    frontDesign?: SortOrder
    brandCommissionPct?: SortOrderInput | SortOrder
    merchantCommissionPct?: SortOrderInput | SortOrder
    Brand?: BrandOrderByWithRelationInput
    features?: FeatureOrderByRelationAggregateInput
    tags?: TagOrderByRelationAggregateInput
    Mockup?: MockupOrderByWithRelationInput
    variants?: ProductVariantOrderByRelationAggregateInput
    User?: UserOrderByWithRelationInput
    sales?: SaleOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    isActive?: BoolFilter<"Product"> | boolean
    brandName?: StringNullableFilter<"Product"> | string | null
    brandId?: StringNullableFilter<"Product"> | string | null
    mockupId?: StringFilter<"Product"> | string
    userId?: StringFilter<"Product"> | string
    visibility?: BoolFilter<"Product"> | boolean
    backDesign?: StringNullableFilter<"Product"> | string | null
    frontDesign?: StringFilter<"Product"> | string
    brandCommissionPct?: FloatNullableFilter<"Product"> | number | null
    merchantCommissionPct?: FloatNullableFilter<"Product"> | number | null
    Brand?: XOR<BrandNullableScalarRelationFilter, BrandWhereInput> | null
    features?: FeatureListRelationFilter
    tags?: TagListRelationFilter
    Mockup?: XOR<MockupScalarRelationFilter, MockupWhereInput>
    variants?: ProductVariantListRelationFilter
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
    sales?: SaleListRelationFilter
  }, "id" | "productId">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brandName?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    mockupId?: SortOrder
    userId?: SortOrder
    visibility?: SortOrder
    backDesign?: SortOrderInput | SortOrder
    frontDesign?: SortOrder
    brandCommissionPct?: SortOrderInput | SortOrder
    merchantCommissionPct?: SortOrderInput | SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    productId?: StringWithAggregatesFilter<"Product"> | string
    title?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    price?: FloatWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    brandName?: StringNullableWithAggregatesFilter<"Product"> | string | null
    brandId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    mockupId?: StringWithAggregatesFilter<"Product"> | string
    userId?: StringWithAggregatesFilter<"Product"> | string
    visibility?: BoolWithAggregatesFilter<"Product"> | boolean
    backDesign?: StringNullableWithAggregatesFilter<"Product"> | string | null
    frontDesign?: StringWithAggregatesFilter<"Product"> | string
    brandCommissionPct?: FloatNullableWithAggregatesFilter<"Product"> | number | null
    merchantCommissionPct?: FloatNullableWithAggregatesFilter<"Product"> | number | null
  }

  export type SaleWhereInput = {
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    id?: StringFilter<"Sale"> | string
    productId?: StringFilter<"Sale"> | string
    merchantId?: StringFilter<"Sale"> | string
    brandId?: StringNullableFilter<"Sale"> | string | null
    quantity?: IntFilter<"Sale"> | number
    total?: FloatFilter<"Sale"> | number
    brandEarning?: FloatFilter<"Sale"> | number
    merchantEarning?: FloatFilter<"Sale"> | number
    platformEarning?: FloatFilter<"Sale"> | number
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    merchant?: XOR<UserScalarRelationFilter, UserWhereInput>
    brand?: XOR<BrandNullableScalarRelationFilter, BrandWhereInput> | null
  }

  export type SaleOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    merchantId?: SortOrder
    brandId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
    createdAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    merchant?: UserOrderByWithRelationInput
    brand?: BrandOrderByWithRelationInput
  }

  export type SaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    productId?: StringFilter<"Sale"> | string
    merchantId?: StringFilter<"Sale"> | string
    brandId?: StringNullableFilter<"Sale"> | string | null
    quantity?: IntFilter<"Sale"> | number
    total?: FloatFilter<"Sale"> | number
    brandEarning?: FloatFilter<"Sale"> | number
    merchantEarning?: FloatFilter<"Sale"> | number
    platformEarning?: FloatFilter<"Sale"> | number
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    merchant?: XOR<UserScalarRelationFilter, UserWhereInput>
    brand?: XOR<BrandNullableScalarRelationFilter, BrandWhereInput> | null
  }, "id">

  export type SaleOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    merchantId?: SortOrder
    brandId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
    createdAt?: SortOrder
    _count?: SaleCountOrderByAggregateInput
    _avg?: SaleAvgOrderByAggregateInput
    _max?: SaleMaxOrderByAggregateInput
    _min?: SaleMinOrderByAggregateInput
    _sum?: SaleSumOrderByAggregateInput
  }

  export type SaleScalarWhereWithAggregatesInput = {
    AND?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    OR?: SaleScalarWhereWithAggregatesInput[]
    NOT?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sale"> | string
    productId?: StringWithAggregatesFilter<"Sale"> | string
    merchantId?: StringWithAggregatesFilter<"Sale"> | string
    brandId?: StringNullableWithAggregatesFilter<"Sale"> | string | null
    quantity?: IntWithAggregatesFilter<"Sale"> | number
    total?: FloatWithAggregatesFilter<"Sale"> | number
    brandEarning?: FloatWithAggregatesFilter<"Sale"> | number
    merchantEarning?: FloatWithAggregatesFilter<"Sale"> | number
    platformEarning?: FloatWithAggregatesFilter<"Sale"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Sale"> | Date | string
  }

  export type ProductVariantWhereInput = {
    AND?: ProductVariantWhereInput | ProductVariantWhereInput[]
    OR?: ProductVariantWhereInput[]
    NOT?: ProductVariantWhereInput | ProductVariantWhereInput[]
    id?: StringFilter<"ProductVariant"> | string
    productId?: StringFilter<"ProductVariant"> | string
    color?: StringFilter<"ProductVariant"> | string
    fitType?: EnumFitTypeFilter<"ProductVariant"> | $Enums.FitType
    frontImg?: StringFilter<"ProductVariant"> | string
    backImg?: StringNullableFilter<"ProductVariant"> | string | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductVariantOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrderInput | SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductVariantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId_color_fitType?: ProductVariantProductIdColorFitTypeCompoundUniqueInput
    AND?: ProductVariantWhereInput | ProductVariantWhereInput[]
    OR?: ProductVariantWhereInput[]
    NOT?: ProductVariantWhereInput | ProductVariantWhereInput[]
    productId?: StringFilter<"ProductVariant"> | string
    color?: StringFilter<"ProductVariant"> | string
    fitType?: EnumFitTypeFilter<"ProductVariant"> | $Enums.FitType
    frontImg?: StringFilter<"ProductVariant"> | string
    backImg?: StringNullableFilter<"ProductVariant"> | string | null
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id" | "productId_color_fitType">

  export type ProductVariantOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrderInput | SortOrder
    _count?: ProductVariantCountOrderByAggregateInput
    _max?: ProductVariantMaxOrderByAggregateInput
    _min?: ProductVariantMinOrderByAggregateInput
  }

  export type ProductVariantScalarWhereWithAggregatesInput = {
    AND?: ProductVariantScalarWhereWithAggregatesInput | ProductVariantScalarWhereWithAggregatesInput[]
    OR?: ProductVariantScalarWhereWithAggregatesInput[]
    NOT?: ProductVariantScalarWhereWithAggregatesInput | ProductVariantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductVariant"> | string
    productId?: StringWithAggregatesFilter<"ProductVariant"> | string
    color?: StringWithAggregatesFilter<"ProductVariant"> | string
    fitType?: EnumFitTypeWithAggregatesFilter<"ProductVariant"> | $Enums.FitType
    frontImg?: StringWithAggregatesFilter<"ProductVariant"> | string
    backImg?: StringNullableWithAggregatesFilter<"ProductVariant"> | string | null
  }

  export type FeatureWhereInput = {
    AND?: FeatureWhereInput | FeatureWhereInput[]
    OR?: FeatureWhereInput[]
    NOT?: FeatureWhereInput | FeatureWhereInput[]
    id?: StringFilter<"Feature"> | string
    productId?: StringFilter<"Feature"> | string
    content?: StringFilter<"Feature"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type FeatureOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    content?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type FeatureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeatureWhereInput | FeatureWhereInput[]
    OR?: FeatureWhereInput[]
    NOT?: FeatureWhereInput | FeatureWhereInput[]
    productId?: StringFilter<"Feature"> | string
    content?: StringFilter<"Feature"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type FeatureOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    content?: SortOrder
    _count?: FeatureCountOrderByAggregateInput
    _max?: FeatureMaxOrderByAggregateInput
    _min?: FeatureMinOrderByAggregateInput
  }

  export type FeatureScalarWhereWithAggregatesInput = {
    AND?: FeatureScalarWhereWithAggregatesInput | FeatureScalarWhereWithAggregatesInput[]
    OR?: FeatureScalarWhereWithAggregatesInput[]
    NOT?: FeatureScalarWhereWithAggregatesInput | FeatureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Feature"> | string
    productId?: StringWithAggregatesFilter<"Feature"> | string
    content?: StringWithAggregatesFilter<"Feature"> | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    productId?: StringFilter<"Tag"> | string
    value?: StringFilter<"Tag"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    value?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    productId?: StringFilter<"Tag"> | string
    value?: StringFilter<"Tag"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    value?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    productId?: StringWithAggregatesFilter<"Tag"> | string
    value?: StringWithAggregatesFilter<"Tag"> | string
  }

  export type MockupWhereInput = {
    AND?: MockupWhereInput | MockupWhereInput[]
    OR?: MockupWhereInput[]
    NOT?: MockupWhereInput | MockupWhereInput[]
    id?: StringFilter<"Mockup"> | string
    name?: StringFilter<"Mockup"> | string
    createdAt?: DateTimeFilter<"Mockup"> | Date | string
    updatedAt?: DateTimeFilter<"Mockup"> | Date | string
    variants?: MockupVariantListRelationFilter
    Product?: ProductListRelationFilter
  }

  export type MockupOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    variants?: MockupVariantOrderByRelationAggregateInput
    Product?: ProductOrderByRelationAggregateInput
  }

  export type MockupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MockupWhereInput | MockupWhereInput[]
    OR?: MockupWhereInput[]
    NOT?: MockupWhereInput | MockupWhereInput[]
    name?: StringFilter<"Mockup"> | string
    createdAt?: DateTimeFilter<"Mockup"> | Date | string
    updatedAt?: DateTimeFilter<"Mockup"> | Date | string
    variants?: MockupVariantListRelationFilter
    Product?: ProductListRelationFilter
  }, "id">

  export type MockupOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MockupCountOrderByAggregateInput
    _max?: MockupMaxOrderByAggregateInput
    _min?: MockupMinOrderByAggregateInput
  }

  export type MockupScalarWhereWithAggregatesInput = {
    AND?: MockupScalarWhereWithAggregatesInput | MockupScalarWhereWithAggregatesInput[]
    OR?: MockupScalarWhereWithAggregatesInput[]
    NOT?: MockupScalarWhereWithAggregatesInput | MockupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Mockup"> | string
    name?: StringWithAggregatesFilter<"Mockup"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Mockup"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Mockup"> | Date | string
  }

  export type MockupVariantWhereInput = {
    AND?: MockupVariantWhereInput | MockupVariantWhereInput[]
    OR?: MockupVariantWhereInput[]
    NOT?: MockupVariantWhereInput | MockupVariantWhereInput[]
    id?: StringFilter<"MockupVariant"> | string
    mockupId?: StringFilter<"MockupVariant"> | string
    color?: StringFilter<"MockupVariant"> | string
    fitType?: EnumFitTypeFilter<"MockupVariant"> | $Enums.FitType
    frontImg?: StringFilter<"MockupVariant"> | string
    backImg?: StringFilter<"MockupVariant"> | string
    mockup?: XOR<MockupScalarRelationFilter, MockupWhereInput>
  }

  export type MockupVariantOrderByWithRelationInput = {
    id?: SortOrder
    mockupId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
    mockup?: MockupOrderByWithRelationInput
  }

  export type MockupVariantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mockupId_color_fitType?: MockupVariantMockupIdColorFitTypeCompoundUniqueInput
    AND?: MockupVariantWhereInput | MockupVariantWhereInput[]
    OR?: MockupVariantWhereInput[]
    NOT?: MockupVariantWhereInput | MockupVariantWhereInput[]
    mockupId?: StringFilter<"MockupVariant"> | string
    color?: StringFilter<"MockupVariant"> | string
    fitType?: EnumFitTypeFilter<"MockupVariant"> | $Enums.FitType
    frontImg?: StringFilter<"MockupVariant"> | string
    backImg?: StringFilter<"MockupVariant"> | string
    mockup?: XOR<MockupScalarRelationFilter, MockupWhereInput>
  }, "id" | "mockupId_color_fitType">

  export type MockupVariantOrderByWithAggregationInput = {
    id?: SortOrder
    mockupId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
    _count?: MockupVariantCountOrderByAggregateInput
    _max?: MockupVariantMaxOrderByAggregateInput
    _min?: MockupVariantMinOrderByAggregateInput
  }

  export type MockupVariantScalarWhereWithAggregatesInput = {
    AND?: MockupVariantScalarWhereWithAggregatesInput | MockupVariantScalarWhereWithAggregatesInput[]
    OR?: MockupVariantScalarWhereWithAggregatesInput[]
    NOT?: MockupVariantScalarWhereWithAggregatesInput | MockupVariantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MockupVariant"> | string
    mockupId?: StringWithAggregatesFilter<"MockupVariant"> | string
    color?: StringWithAggregatesFilter<"MockupVariant"> | string
    fitType?: EnumFitTypeWithAggregatesFilter<"MockupVariant"> | $Enums.FitType
    frontImg?: StringWithAggregatesFilter<"MockupVariant"> | string
    backImg?: StringWithAggregatesFilter<"MockupVariant"> | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandCreateNestedManyWithoutUserInput
    products?: ProductCreateNestedManyWithoutUserInput
    sales?: SaleCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandUncheckedCreateNestedManyWithoutUserInput
    products?: ProductUncheckedCreateNestedManyWithoutUserInput
    sales?: SaleUncheckedCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUpdateManyWithoutUserNestedInput
    products?: ProductUpdateManyWithoutUserNestedInput
    sales?: SaleUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUncheckedUpdateManyWithoutUserNestedInput
    products?: ProductUncheckedUpdateManyWithoutUserNestedInput
    sales?: SaleUncheckedUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MerchantProfileCreateInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl?: string | null
    websiteUrl?: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message?: string | null
    tiar?: number
    brandOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMerchantProfileInput
  }

  export type MerchantProfileUncheckedCreateInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl?: string | null
    websiteUrl?: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message?: string | null
    tiar?: number
    brandOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMerchantProfileNestedInput
  }

  export type MerchantProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantProfileCreateManyInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl?: string | null
    websiteUrl?: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message?: string | null
    tiar?: number
    brandOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    brandCategory: BrandCategoryCreateNestedOneWithoutBrandInput
    user: UserCreateNestedOneWithoutBrandsInput
    Product?: ProductCreateNestedManyWithoutBrandInput
    Sales?: SaleCreateNestedManyWithoutBrandInput
  }

  export type BrandUncheckedCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    Product?: ProductUncheckedCreateNestedManyWithoutBrandInput
    Sales?: SaleUncheckedCreateNestedManyWithoutBrandInput
  }

  export type BrandUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    brandCategory?: BrandCategoryUpdateOneRequiredWithoutBrandNestedInput
    user?: UserUpdateOneRequiredWithoutBrandsNestedInput
    Product?: ProductUpdateManyWithoutBrandNestedInput
    Sales?: SaleUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    Product?: ProductUncheckedUpdateManyWithoutBrandNestedInput
    Sales?: SaleUncheckedUpdateManyWithoutBrandNestedInput
  }

  export type BrandCreateManyInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
  }

  export type BrandUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
  }

  export type BrandUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
  }

  export type BrandCategoryCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Brand?: BrandCreateNestedManyWithoutBrandCategoryInput
  }

  export type BrandCategoryUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Brand?: BrandUncheckedCreateNestedManyWithoutBrandCategoryInput
  }

  export type BrandCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Brand?: BrandUpdateManyWithoutBrandCategoryNestedInput
  }

  export type BrandCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Brand?: BrandUncheckedUpdateManyWithoutBrandCategoryNestedInput
  }

  export type BrandCategoryCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type SaleCreateInput = {
    id?: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutSalesInput
    merchant: UserCreateNestedOneWithoutSalesInput
    brand?: BrandCreateNestedOneWithoutSalesInput
  }

  export type SaleUncheckedCreateInput = {
    id?: string
    productId: string
    merchantId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type SaleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSalesNestedInput
    merchant?: UserUpdateOneRequiredWithoutSalesNestedInput
    brand?: BrandUpdateOneWithoutSalesNestedInput
  }

  export type SaleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleCreateManyInput = {
    id?: string
    productId: string
    merchantId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type SaleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductVariantCreateInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
    product: ProductCreateNestedOneWithoutVariantsInput
  }

  export type ProductVariantUncheckedCreateInput = {
    id?: string
    productId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
  }

  export type ProductVariantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
    product?: ProductUpdateOneRequiredWithoutVariantsNestedInput
  }

  export type ProductVariantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductVariantCreateManyInput = {
    id?: string
    productId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
  }

  export type ProductVariantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductVariantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FeatureCreateInput = {
    id?: string
    content: string
    product: ProductCreateNestedOneWithoutFeaturesInput
  }

  export type FeatureUncheckedCreateInput = {
    id?: string
    productId: string
    content: string
  }

  export type FeatureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutFeaturesNestedInput
  }

  export type FeatureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type FeatureCreateManyInput = {
    id?: string
    productId: string
    content: string
  }

  export type FeatureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type FeatureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type TagCreateInput = {
    id?: string
    value: string
    product: ProductCreateNestedOneWithoutTagsInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    productId: string
    value: string
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutTagsNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type TagCreateManyInput = {
    id?: string
    productId: string
    value: string
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type MockupCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: MockupVariantCreateNestedManyWithoutMockupInput
    Product?: ProductCreateNestedManyWithoutMockupInput
  }

  export type MockupUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: MockupVariantUncheckedCreateNestedManyWithoutMockupInput
    Product?: ProductUncheckedCreateNestedManyWithoutMockupInput
  }

  export type MockupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: MockupVariantUpdateManyWithoutMockupNestedInput
    Product?: ProductUpdateManyWithoutMockupNestedInput
  }

  export type MockupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: MockupVariantUncheckedUpdateManyWithoutMockupNestedInput
    Product?: ProductUncheckedUpdateManyWithoutMockupNestedInput
  }

  export type MockupCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MockupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockupVariantCreateInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
    mockup: MockupCreateNestedOneWithoutVariantsInput
  }

  export type MockupVariantUncheckedCreateInput = {
    id?: string
    mockupId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
  }

  export type MockupVariantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
    mockup?: MockupUpdateOneRequiredWithoutVariantsNestedInput
  }

  export type MockupVariantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mockupId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type MockupVariantCreateManyInput = {
    id?: string
    mockupId: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
  }

  export type MockupVariantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type MockupVariantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mockupId?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BrandListRelationFilter = {
    every?: BrandWhereInput
    some?: BrandWhereInput
    none?: BrandWhereInput
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type SaleListRelationFilter = {
    every?: SaleWhereInput
    some?: SaleWhereInput
    none?: SaleWhereInput
  }

  export type MerchantProfileNullableScalarRelationFilter = {
    is?: MerchantProfileWhereInput | null
    isNot?: MerchantProfileWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BrandOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SaleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MerchantProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    nidOrPassportNo?: SortOrder
    presentAddress?: SortOrder
    permanentAddress?: SortOrder
    portfolioUrl?: SortOrder
    websiteUrl?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    accountName?: SortOrder
    accountNumber?: SortOrder
    routingNumber?: SortOrder
    message?: SortOrder
    tiar?: SortOrder
    brandOption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantProfileAvgOrderByAggregateInput = {
    tiar?: SortOrder
  }

  export type MerchantProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    nidOrPassportNo?: SortOrder
    presentAddress?: SortOrder
    permanentAddress?: SortOrder
    portfolioUrl?: SortOrder
    websiteUrl?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    accountName?: SortOrder
    accountNumber?: SortOrder
    routingNumber?: SortOrder
    message?: SortOrder
    tiar?: SortOrder
    brandOption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    nidOrPassportNo?: SortOrder
    presentAddress?: SortOrder
    permanentAddress?: SortOrder
    portfolioUrl?: SortOrder
    websiteUrl?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    accountName?: SortOrder
    accountNumber?: SortOrder
    routingNumber?: SortOrder
    message?: SortOrder
    tiar?: SortOrder
    brandOption?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantProfileSumOrderByAggregateInput = {
    tiar?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BrandCategoryScalarRelationFilter = {
    is?: BrandCategoryWhereInput
    isNot?: BrandCategoryWhereInput
  }

  export type BrandCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brandCategoryId?: SortOrder
    userId?: SortOrder
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
  }

  export type BrandAvgOrderByAggregateInput = {
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
  }

  export type BrandMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brandCategoryId?: SortOrder
    userId?: SortOrder
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
  }

  export type BrandMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brandCategoryId?: SortOrder
    userId?: SortOrder
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
  }

  export type BrandSumOrderByAggregateInput = {
    defaultBrandPct?: SortOrder
    defaultMerchantPct?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BrandCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BrandCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BrandCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BrandNullableScalarRelationFilter = {
    is?: BrandWhereInput | null
    isNot?: BrandWhereInput | null
  }

  export type FeatureListRelationFilter = {
    every?: FeatureWhereInput
    some?: FeatureWhereInput
    none?: FeatureWhereInput
  }

  export type TagListRelationFilter = {
    every?: TagWhereInput
    some?: TagWhereInput
    none?: TagWhereInput
  }

  export type MockupScalarRelationFilter = {
    is?: MockupWhereInput
    isNot?: MockupWhereInput
  }

  export type ProductVariantListRelationFilter = {
    every?: ProductVariantWhereInput
    some?: ProductVariantWhereInput
    none?: ProductVariantWhereInput
  }

  export type FeatureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductVariantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brandName?: SortOrder
    brandId?: SortOrder
    mockupId?: SortOrder
    userId?: SortOrder
    visibility?: SortOrder
    backDesign?: SortOrder
    frontDesign?: SortOrder
    brandCommissionPct?: SortOrder
    merchantCommissionPct?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
    brandCommissionPct?: SortOrder
    merchantCommissionPct?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brandName?: SortOrder
    brandId?: SortOrder
    mockupId?: SortOrder
    userId?: SortOrder
    visibility?: SortOrder
    backDesign?: SortOrder
    frontDesign?: SortOrder
    brandCommissionPct?: SortOrder
    merchantCommissionPct?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    brandName?: SortOrder
    brandId?: SortOrder
    mockupId?: SortOrder
    userId?: SortOrder
    visibility?: SortOrder
    backDesign?: SortOrder
    frontDesign?: SortOrder
    brandCommissionPct?: SortOrder
    merchantCommissionPct?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
    brandCommissionPct?: SortOrder
    merchantCommissionPct?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type SaleCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    merchantId?: SortOrder
    brandId?: SortOrder
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
    createdAt?: SortOrder
  }

  export type SaleAvgOrderByAggregateInput = {
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
  }

  export type SaleMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    merchantId?: SortOrder
    brandId?: SortOrder
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
    createdAt?: SortOrder
  }

  export type SaleMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    merchantId?: SortOrder
    brandId?: SortOrder
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
    createdAt?: SortOrder
  }

  export type SaleSumOrderByAggregateInput = {
    quantity?: SortOrder
    total?: SortOrder
    brandEarning?: SortOrder
    merchantEarning?: SortOrder
    platformEarning?: SortOrder
  }

  export type EnumFitTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FitType | EnumFitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFitTypeFilter<$PrismaModel> | $Enums.FitType
  }

  export type ProductVariantProductIdColorFitTypeCompoundUniqueInput = {
    productId: string
    color: string
    fitType: $Enums.FitType
  }

  export type ProductVariantCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type ProductVariantMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type ProductVariantMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type EnumFitTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FitType | EnumFitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFitTypeWithAggregatesFilter<$PrismaModel> | $Enums.FitType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFitTypeFilter<$PrismaModel>
    _max?: NestedEnumFitTypeFilter<$PrismaModel>
  }

  export type FeatureCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    content?: SortOrder
  }

  export type FeatureMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    content?: SortOrder
  }

  export type FeatureMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    content?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    value?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    value?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    value?: SortOrder
  }

  export type MockupVariantListRelationFilter = {
    every?: MockupVariantWhereInput
    some?: MockupVariantWhereInput
    none?: MockupVariantWhereInput
  }

  export type MockupVariantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MockupCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MockupMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MockupMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MockupVariantMockupIdColorFitTypeCompoundUniqueInput = {
    mockupId: string
    color: string
    fitType: $Enums.FitType
  }

  export type MockupVariantCountOrderByAggregateInput = {
    id?: SortOrder
    mockupId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type MockupVariantMaxOrderByAggregateInput = {
    id?: SortOrder
    mockupId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type MockupVariantMinOrderByAggregateInput = {
    id?: SortOrder
    mockupId?: SortOrder
    color?: SortOrder
    fitType?: SortOrder
    frontImg?: SortOrder
    backImg?: SortOrder
  }

  export type BrandCreateNestedManyWithoutUserInput = {
    create?: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput> | BrandCreateWithoutUserInput[] | BrandUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutUserInput | BrandCreateOrConnectWithoutUserInput[]
    createMany?: BrandCreateManyUserInputEnvelope
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
  }

  export type ProductCreateNestedManyWithoutUserInput = {
    create?: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput> | ProductCreateWithoutUserInput[] | ProductUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutUserInput | ProductCreateOrConnectWithoutUserInput[]
    createMany?: ProductCreateManyUserInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SaleCreateNestedManyWithoutMerchantInput = {
    create?: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput> | SaleCreateWithoutMerchantInput[] | SaleUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutMerchantInput | SaleCreateOrConnectWithoutMerchantInput[]
    createMany?: SaleCreateManyMerchantInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type MerchantProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MerchantProfileCreateOrConnectWithoutUserInput
    connect?: MerchantProfileWhereUniqueInput
  }

  export type BrandUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput> | BrandCreateWithoutUserInput[] | BrandUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutUserInput | BrandCreateOrConnectWithoutUserInput[]
    createMany?: BrandCreateManyUserInputEnvelope
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput> | ProductCreateWithoutUserInput[] | ProductUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutUserInput | ProductCreateOrConnectWithoutUserInput[]
    createMany?: ProductCreateManyUserInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput> | SaleCreateWithoutMerchantInput[] | SaleUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutMerchantInput | SaleCreateOrConnectWithoutMerchantInput[]
    createMany?: SaleCreateManyMerchantInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type MerchantProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MerchantProfileCreateOrConnectWithoutUserInput
    connect?: MerchantProfileWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BrandUpdateManyWithoutUserNestedInput = {
    create?: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput> | BrandCreateWithoutUserInput[] | BrandUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutUserInput | BrandCreateOrConnectWithoutUserInput[]
    upsert?: BrandUpsertWithWhereUniqueWithoutUserInput | BrandUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BrandCreateManyUserInputEnvelope
    set?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    disconnect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    delete?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    update?: BrandUpdateWithWhereUniqueWithoutUserInput | BrandUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BrandUpdateManyWithWhereWithoutUserInput | BrandUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BrandScalarWhereInput | BrandScalarWhereInput[]
  }

  export type ProductUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput> | ProductCreateWithoutUserInput[] | ProductUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutUserInput | ProductCreateOrConnectWithoutUserInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutUserInput | ProductUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProductCreateManyUserInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutUserInput | ProductUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutUserInput | ProductUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SaleUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput> | SaleCreateWithoutMerchantInput[] | SaleUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutMerchantInput | SaleCreateOrConnectWithoutMerchantInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutMerchantInput | SaleUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: SaleCreateManyMerchantInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutMerchantInput | SaleUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutMerchantInput | SaleUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type MerchantProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MerchantProfileCreateOrConnectWithoutUserInput
    upsert?: MerchantProfileUpsertWithoutUserInput
    disconnect?: MerchantProfileWhereInput | boolean
    delete?: MerchantProfileWhereInput | boolean
    connect?: MerchantProfileWhereUniqueInput
    update?: XOR<XOR<MerchantProfileUpdateToOneWithWhereWithoutUserInput, MerchantProfileUpdateWithoutUserInput>, MerchantProfileUncheckedUpdateWithoutUserInput>
  }

  export type BrandUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput> | BrandCreateWithoutUserInput[] | BrandUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutUserInput | BrandCreateOrConnectWithoutUserInput[]
    upsert?: BrandUpsertWithWhereUniqueWithoutUserInput | BrandUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BrandCreateManyUserInputEnvelope
    set?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    disconnect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    delete?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    update?: BrandUpdateWithWhereUniqueWithoutUserInput | BrandUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BrandUpdateManyWithWhereWithoutUserInput | BrandUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BrandScalarWhereInput | BrandScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput> | ProductCreateWithoutUserInput[] | ProductUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutUserInput | ProductCreateOrConnectWithoutUserInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutUserInput | ProductUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProductCreateManyUserInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutUserInput | ProductUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutUserInput | ProductUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SaleUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput> | SaleCreateWithoutMerchantInput[] | SaleUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutMerchantInput | SaleCreateOrConnectWithoutMerchantInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutMerchantInput | SaleUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: SaleCreateManyMerchantInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutMerchantInput | SaleUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutMerchantInput | SaleUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type MerchantProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MerchantProfileCreateOrConnectWithoutUserInput
    upsert?: MerchantProfileUpsertWithoutUserInput
    disconnect?: MerchantProfileWhereInput | boolean
    delete?: MerchantProfileWhereInput | boolean
    connect?: MerchantProfileWhereUniqueInput
    update?: XOR<XOR<MerchantProfileUpdateToOneWithWhereWithoutUserInput, MerchantProfileUpdateWithoutUserInput>, MerchantProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutMerchantProfileInput = {
    create?: XOR<UserCreateWithoutMerchantProfileInput, UserUncheckedCreateWithoutMerchantProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutMerchantProfileInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutMerchantProfileNestedInput = {
    create?: XOR<UserCreateWithoutMerchantProfileInput, UserUncheckedCreateWithoutMerchantProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutMerchantProfileInput
    upsert?: UserUpsertWithoutMerchantProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMerchantProfileInput, UserUpdateWithoutMerchantProfileInput>, UserUncheckedUpdateWithoutMerchantProfileInput>
  }

  export type BrandCategoryCreateNestedOneWithoutBrandInput = {
    create?: XOR<BrandCategoryCreateWithoutBrandInput, BrandCategoryUncheckedCreateWithoutBrandInput>
    connectOrCreate?: BrandCategoryCreateOrConnectWithoutBrandInput
    connect?: BrandCategoryWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBrandsInput = {
    create?: XOR<UserCreateWithoutBrandsInput, UserUncheckedCreateWithoutBrandsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBrandsInput
    connect?: UserWhereUniqueInput
  }

  export type ProductCreateNestedManyWithoutBrandInput = {
    create?: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput> | ProductCreateWithoutBrandInput[] | ProductUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBrandInput | ProductCreateOrConnectWithoutBrandInput[]
    createMany?: ProductCreateManyBrandInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SaleCreateNestedManyWithoutBrandInput = {
    create?: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput> | SaleCreateWithoutBrandInput[] | SaleUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutBrandInput | SaleCreateOrConnectWithoutBrandInput[]
    createMany?: SaleCreateManyBrandInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutBrandInput = {
    create?: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput> | ProductCreateWithoutBrandInput[] | ProductUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBrandInput | ProductCreateOrConnectWithoutBrandInput[]
    createMany?: ProductCreateManyBrandInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutBrandInput = {
    create?: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput> | SaleCreateWithoutBrandInput[] | SaleUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutBrandInput | SaleCreateOrConnectWithoutBrandInput[]
    createMany?: SaleCreateManyBrandInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BrandCategoryUpdateOneRequiredWithoutBrandNestedInput = {
    create?: XOR<BrandCategoryCreateWithoutBrandInput, BrandCategoryUncheckedCreateWithoutBrandInput>
    connectOrCreate?: BrandCategoryCreateOrConnectWithoutBrandInput
    upsert?: BrandCategoryUpsertWithoutBrandInput
    connect?: BrandCategoryWhereUniqueInput
    update?: XOR<XOR<BrandCategoryUpdateToOneWithWhereWithoutBrandInput, BrandCategoryUpdateWithoutBrandInput>, BrandCategoryUncheckedUpdateWithoutBrandInput>
  }

  export type UserUpdateOneRequiredWithoutBrandsNestedInput = {
    create?: XOR<UserCreateWithoutBrandsInput, UserUncheckedCreateWithoutBrandsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBrandsInput
    upsert?: UserUpsertWithoutBrandsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBrandsInput, UserUpdateWithoutBrandsInput>, UserUncheckedUpdateWithoutBrandsInput>
  }

  export type ProductUpdateManyWithoutBrandNestedInput = {
    create?: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput> | ProductCreateWithoutBrandInput[] | ProductUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBrandInput | ProductCreateOrConnectWithoutBrandInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutBrandInput | ProductUpsertWithWhereUniqueWithoutBrandInput[]
    createMany?: ProductCreateManyBrandInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutBrandInput | ProductUpdateWithWhereUniqueWithoutBrandInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutBrandInput | ProductUpdateManyWithWhereWithoutBrandInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SaleUpdateManyWithoutBrandNestedInput = {
    create?: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput> | SaleCreateWithoutBrandInput[] | SaleUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutBrandInput | SaleCreateOrConnectWithoutBrandInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutBrandInput | SaleUpsertWithWhereUniqueWithoutBrandInput[]
    createMany?: SaleCreateManyBrandInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutBrandInput | SaleUpdateWithWhereUniqueWithoutBrandInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutBrandInput | SaleUpdateManyWithWhereWithoutBrandInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutBrandNestedInput = {
    create?: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput> | ProductCreateWithoutBrandInput[] | ProductUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutBrandInput | ProductCreateOrConnectWithoutBrandInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutBrandInput | ProductUpsertWithWhereUniqueWithoutBrandInput[]
    createMany?: ProductCreateManyBrandInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutBrandInput | ProductUpdateWithWhereUniqueWithoutBrandInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutBrandInput | ProductUpdateManyWithWhereWithoutBrandInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type SaleUncheckedUpdateManyWithoutBrandNestedInput = {
    create?: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput> | SaleCreateWithoutBrandInput[] | SaleUncheckedCreateWithoutBrandInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutBrandInput | SaleCreateOrConnectWithoutBrandInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutBrandInput | SaleUpsertWithWhereUniqueWithoutBrandInput[]
    createMany?: SaleCreateManyBrandInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutBrandInput | SaleUpdateWithWhereUniqueWithoutBrandInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutBrandInput | SaleUpdateManyWithWhereWithoutBrandInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type BrandCreateNestedManyWithoutBrandCategoryInput = {
    create?: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput> | BrandCreateWithoutBrandCategoryInput[] | BrandUncheckedCreateWithoutBrandCategoryInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutBrandCategoryInput | BrandCreateOrConnectWithoutBrandCategoryInput[]
    createMany?: BrandCreateManyBrandCategoryInputEnvelope
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
  }

  export type BrandUncheckedCreateNestedManyWithoutBrandCategoryInput = {
    create?: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput> | BrandCreateWithoutBrandCategoryInput[] | BrandUncheckedCreateWithoutBrandCategoryInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutBrandCategoryInput | BrandCreateOrConnectWithoutBrandCategoryInput[]
    createMany?: BrandCreateManyBrandCategoryInputEnvelope
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
  }

  export type BrandUpdateManyWithoutBrandCategoryNestedInput = {
    create?: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput> | BrandCreateWithoutBrandCategoryInput[] | BrandUncheckedCreateWithoutBrandCategoryInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutBrandCategoryInput | BrandCreateOrConnectWithoutBrandCategoryInput[]
    upsert?: BrandUpsertWithWhereUniqueWithoutBrandCategoryInput | BrandUpsertWithWhereUniqueWithoutBrandCategoryInput[]
    createMany?: BrandCreateManyBrandCategoryInputEnvelope
    set?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    disconnect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    delete?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    update?: BrandUpdateWithWhereUniqueWithoutBrandCategoryInput | BrandUpdateWithWhereUniqueWithoutBrandCategoryInput[]
    updateMany?: BrandUpdateManyWithWhereWithoutBrandCategoryInput | BrandUpdateManyWithWhereWithoutBrandCategoryInput[]
    deleteMany?: BrandScalarWhereInput | BrandScalarWhereInput[]
  }

  export type BrandUncheckedUpdateManyWithoutBrandCategoryNestedInput = {
    create?: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput> | BrandCreateWithoutBrandCategoryInput[] | BrandUncheckedCreateWithoutBrandCategoryInput[]
    connectOrCreate?: BrandCreateOrConnectWithoutBrandCategoryInput | BrandCreateOrConnectWithoutBrandCategoryInput[]
    upsert?: BrandUpsertWithWhereUniqueWithoutBrandCategoryInput | BrandUpsertWithWhereUniqueWithoutBrandCategoryInput[]
    createMany?: BrandCreateManyBrandCategoryInputEnvelope
    set?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    disconnect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    delete?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    connect?: BrandWhereUniqueInput | BrandWhereUniqueInput[]
    update?: BrandUpdateWithWhereUniqueWithoutBrandCategoryInput | BrandUpdateWithWhereUniqueWithoutBrandCategoryInput[]
    updateMany?: BrandUpdateManyWithWhereWithoutBrandCategoryInput | BrandUpdateManyWithWhereWithoutBrandCategoryInput[]
    deleteMany?: BrandScalarWhereInput | BrandScalarWhereInput[]
  }

  export type BrandCreateNestedOneWithoutProductInput = {
    create?: XOR<BrandCreateWithoutProductInput, BrandUncheckedCreateWithoutProductInput>
    connectOrCreate?: BrandCreateOrConnectWithoutProductInput
    connect?: BrandWhereUniqueInput
  }

  export type FeatureCreateNestedManyWithoutProductInput = {
    create?: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput> | FeatureCreateWithoutProductInput[] | FeatureUncheckedCreateWithoutProductInput[]
    connectOrCreate?: FeatureCreateOrConnectWithoutProductInput | FeatureCreateOrConnectWithoutProductInput[]
    createMany?: FeatureCreateManyProductInputEnvelope
    connect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
  }

  export type TagCreateNestedManyWithoutProductInput = {
    create?: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput> | TagCreateWithoutProductInput[] | TagUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TagCreateOrConnectWithoutProductInput | TagCreateOrConnectWithoutProductInput[]
    createMany?: TagCreateManyProductInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type MockupCreateNestedOneWithoutProductInput = {
    create?: XOR<MockupCreateWithoutProductInput, MockupUncheckedCreateWithoutProductInput>
    connectOrCreate?: MockupCreateOrConnectWithoutProductInput
    connect?: MockupWhereUniqueInput
  }

  export type ProductVariantCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutProductsInput = {
    create?: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductsInput
    connect?: UserWhereUniqueInput
  }

  export type SaleCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput> | SaleCreateWithoutProductInput[] | SaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutProductInput | SaleCreateOrConnectWithoutProductInput[]
    createMany?: SaleCreateManyProductInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type FeatureUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput> | FeatureCreateWithoutProductInput[] | FeatureUncheckedCreateWithoutProductInput[]
    connectOrCreate?: FeatureCreateOrConnectWithoutProductInput | FeatureCreateOrConnectWithoutProductInput[]
    createMany?: FeatureCreateManyProductInputEnvelope
    connect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
  }

  export type TagUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput> | TagCreateWithoutProductInput[] | TagUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TagCreateOrConnectWithoutProductInput | TagCreateOrConnectWithoutProductInput[]
    createMany?: TagCreateManyProductInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type ProductVariantUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput> | SaleCreateWithoutProductInput[] | SaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutProductInput | SaleCreateOrConnectWithoutProductInput[]
    createMany?: SaleCreateManyProductInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BrandUpdateOneWithoutProductNestedInput = {
    create?: XOR<BrandCreateWithoutProductInput, BrandUncheckedCreateWithoutProductInput>
    connectOrCreate?: BrandCreateOrConnectWithoutProductInput
    upsert?: BrandUpsertWithoutProductInput
    disconnect?: BrandWhereInput | boolean
    delete?: BrandWhereInput | boolean
    connect?: BrandWhereUniqueInput
    update?: XOR<XOR<BrandUpdateToOneWithWhereWithoutProductInput, BrandUpdateWithoutProductInput>, BrandUncheckedUpdateWithoutProductInput>
  }

  export type FeatureUpdateManyWithoutProductNestedInput = {
    create?: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput> | FeatureCreateWithoutProductInput[] | FeatureUncheckedCreateWithoutProductInput[]
    connectOrCreate?: FeatureCreateOrConnectWithoutProductInput | FeatureCreateOrConnectWithoutProductInput[]
    upsert?: FeatureUpsertWithWhereUniqueWithoutProductInput | FeatureUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: FeatureCreateManyProductInputEnvelope
    set?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    disconnect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    delete?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    connect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    update?: FeatureUpdateWithWhereUniqueWithoutProductInput | FeatureUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: FeatureUpdateManyWithWhereWithoutProductInput | FeatureUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: FeatureScalarWhereInput | FeatureScalarWhereInput[]
  }

  export type TagUpdateManyWithoutProductNestedInput = {
    create?: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput> | TagCreateWithoutProductInput[] | TagUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TagCreateOrConnectWithoutProductInput | TagCreateOrConnectWithoutProductInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutProductInput | TagUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: TagCreateManyProductInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutProductInput | TagUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: TagUpdateManyWithWhereWithoutProductInput | TagUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type MockupUpdateOneRequiredWithoutProductNestedInput = {
    create?: XOR<MockupCreateWithoutProductInput, MockupUncheckedCreateWithoutProductInput>
    connectOrCreate?: MockupCreateOrConnectWithoutProductInput
    upsert?: MockupUpsertWithoutProductInput
    connect?: MockupWhereUniqueInput
    update?: XOR<XOR<MockupUpdateToOneWithWhereWithoutProductInput, MockupUpdateWithoutProductInput>, MockupUncheckedUpdateWithoutProductInput>
  }

  export type ProductVariantUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutProductInput | ProductVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutProductInput | ProductVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutProductInput | ProductVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductsInput
    upsert?: UserUpsertWithoutProductsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProductsInput, UserUpdateWithoutProductsInput>, UserUncheckedUpdateWithoutProductsInput>
  }

  export type SaleUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput> | SaleCreateWithoutProductInput[] | SaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutProductInput | SaleCreateOrConnectWithoutProductInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutProductInput | SaleUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleCreateManyProductInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutProductInput | SaleUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutProductInput | SaleUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type FeatureUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput> | FeatureCreateWithoutProductInput[] | FeatureUncheckedCreateWithoutProductInput[]
    connectOrCreate?: FeatureCreateOrConnectWithoutProductInput | FeatureCreateOrConnectWithoutProductInput[]
    upsert?: FeatureUpsertWithWhereUniqueWithoutProductInput | FeatureUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: FeatureCreateManyProductInputEnvelope
    set?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    disconnect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    delete?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    connect?: FeatureWhereUniqueInput | FeatureWhereUniqueInput[]
    update?: FeatureUpdateWithWhereUniqueWithoutProductInput | FeatureUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: FeatureUpdateManyWithWhereWithoutProductInput | FeatureUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: FeatureScalarWhereInput | FeatureScalarWhereInput[]
  }

  export type TagUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput> | TagCreateWithoutProductInput[] | TagUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TagCreateOrConnectWithoutProductInput | TagCreateOrConnectWithoutProductInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutProductInput | TagUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: TagCreateManyProductInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutProductInput | TagUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: TagUpdateManyWithWhereWithoutProductInput | TagUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type ProductVariantUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutProductInput | ProductVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutProductInput | ProductVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutProductInput | ProductVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type SaleUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput> | SaleCreateWithoutProductInput[] | SaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutProductInput | SaleCreateOrConnectWithoutProductInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutProductInput | SaleUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleCreateManyProductInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutProductInput | SaleUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutProductInput | SaleUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutSalesInput = {
    create?: XOR<ProductCreateWithoutSalesInput, ProductUncheckedCreateWithoutSalesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSalesInput
    connect?: ProductWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSalesInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    connect?: UserWhereUniqueInput
  }

  export type BrandCreateNestedOneWithoutSalesInput = {
    create?: XOR<BrandCreateWithoutSalesInput, BrandUncheckedCreateWithoutSalesInput>
    connectOrCreate?: BrandCreateOrConnectWithoutSalesInput
    connect?: BrandWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutSalesNestedInput = {
    create?: XOR<ProductCreateWithoutSalesInput, ProductUncheckedCreateWithoutSalesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSalesInput
    upsert?: ProductUpsertWithoutSalesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutSalesInput, ProductUpdateWithoutSalesInput>, ProductUncheckedUpdateWithoutSalesInput>
  }

  export type UserUpdateOneRequiredWithoutSalesNestedInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    upsert?: UserUpsertWithoutSalesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSalesInput, UserUpdateWithoutSalesInput>, UserUncheckedUpdateWithoutSalesInput>
  }

  export type BrandUpdateOneWithoutSalesNestedInput = {
    create?: XOR<BrandCreateWithoutSalesInput, BrandUncheckedCreateWithoutSalesInput>
    connectOrCreate?: BrandCreateOrConnectWithoutSalesInput
    upsert?: BrandUpsertWithoutSalesInput
    disconnect?: BrandWhereInput | boolean
    delete?: BrandWhereInput | boolean
    connect?: BrandWhereUniqueInput
    update?: XOR<XOR<BrandUpdateToOneWithWhereWithoutSalesInput, BrandUpdateWithoutSalesInput>, BrandUncheckedUpdateWithoutSalesInput>
  }

  export type ProductCreateNestedOneWithoutVariantsInput = {
    create?: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutVariantsInput
    connect?: ProductWhereUniqueInput
  }

  export type EnumFitTypeFieldUpdateOperationsInput = {
    set?: $Enums.FitType
  }

  export type ProductUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutVariantsInput
    upsert?: ProductUpsertWithoutVariantsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutVariantsInput, ProductUpdateWithoutVariantsInput>, ProductUncheckedUpdateWithoutVariantsInput>
  }

  export type ProductCreateNestedOneWithoutFeaturesInput = {
    create?: XOR<ProductCreateWithoutFeaturesInput, ProductUncheckedCreateWithoutFeaturesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutFeaturesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutFeaturesNestedInput = {
    create?: XOR<ProductCreateWithoutFeaturesInput, ProductUncheckedCreateWithoutFeaturesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutFeaturesInput
    upsert?: ProductUpsertWithoutFeaturesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutFeaturesInput, ProductUpdateWithoutFeaturesInput>, ProductUncheckedUpdateWithoutFeaturesInput>
  }

  export type ProductCreateNestedOneWithoutTagsInput = {
    create?: XOR<ProductCreateWithoutTagsInput, ProductUncheckedCreateWithoutTagsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutTagsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<ProductCreateWithoutTagsInput, ProductUncheckedCreateWithoutTagsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutTagsInput
    upsert?: ProductUpsertWithoutTagsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutTagsInput, ProductUpdateWithoutTagsInput>, ProductUncheckedUpdateWithoutTagsInput>
  }

  export type MockupVariantCreateNestedManyWithoutMockupInput = {
    create?: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput> | MockupVariantCreateWithoutMockupInput[] | MockupVariantUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: MockupVariantCreateOrConnectWithoutMockupInput | MockupVariantCreateOrConnectWithoutMockupInput[]
    createMany?: MockupVariantCreateManyMockupInputEnvelope
    connect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
  }

  export type ProductCreateNestedManyWithoutMockupInput = {
    create?: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput> | ProductCreateWithoutMockupInput[] | ProductUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMockupInput | ProductCreateOrConnectWithoutMockupInput[]
    createMany?: ProductCreateManyMockupInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type MockupVariantUncheckedCreateNestedManyWithoutMockupInput = {
    create?: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput> | MockupVariantCreateWithoutMockupInput[] | MockupVariantUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: MockupVariantCreateOrConnectWithoutMockupInput | MockupVariantCreateOrConnectWithoutMockupInput[]
    createMany?: MockupVariantCreateManyMockupInputEnvelope
    connect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutMockupInput = {
    create?: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput> | ProductCreateWithoutMockupInput[] | ProductUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMockupInput | ProductCreateOrConnectWithoutMockupInput[]
    createMany?: ProductCreateManyMockupInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type MockupVariantUpdateManyWithoutMockupNestedInput = {
    create?: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput> | MockupVariantCreateWithoutMockupInput[] | MockupVariantUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: MockupVariantCreateOrConnectWithoutMockupInput | MockupVariantCreateOrConnectWithoutMockupInput[]
    upsert?: MockupVariantUpsertWithWhereUniqueWithoutMockupInput | MockupVariantUpsertWithWhereUniqueWithoutMockupInput[]
    createMany?: MockupVariantCreateManyMockupInputEnvelope
    set?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    disconnect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    delete?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    connect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    update?: MockupVariantUpdateWithWhereUniqueWithoutMockupInput | MockupVariantUpdateWithWhereUniqueWithoutMockupInput[]
    updateMany?: MockupVariantUpdateManyWithWhereWithoutMockupInput | MockupVariantUpdateManyWithWhereWithoutMockupInput[]
    deleteMany?: MockupVariantScalarWhereInput | MockupVariantScalarWhereInput[]
  }

  export type ProductUpdateManyWithoutMockupNestedInput = {
    create?: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput> | ProductCreateWithoutMockupInput[] | ProductUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMockupInput | ProductCreateOrConnectWithoutMockupInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutMockupInput | ProductUpsertWithWhereUniqueWithoutMockupInput[]
    createMany?: ProductCreateManyMockupInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutMockupInput | ProductUpdateWithWhereUniqueWithoutMockupInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutMockupInput | ProductUpdateManyWithWhereWithoutMockupInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type MockupVariantUncheckedUpdateManyWithoutMockupNestedInput = {
    create?: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput> | MockupVariantCreateWithoutMockupInput[] | MockupVariantUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: MockupVariantCreateOrConnectWithoutMockupInput | MockupVariantCreateOrConnectWithoutMockupInput[]
    upsert?: MockupVariantUpsertWithWhereUniqueWithoutMockupInput | MockupVariantUpsertWithWhereUniqueWithoutMockupInput[]
    createMany?: MockupVariantCreateManyMockupInputEnvelope
    set?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    disconnect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    delete?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    connect?: MockupVariantWhereUniqueInput | MockupVariantWhereUniqueInput[]
    update?: MockupVariantUpdateWithWhereUniqueWithoutMockupInput | MockupVariantUpdateWithWhereUniqueWithoutMockupInput[]
    updateMany?: MockupVariantUpdateManyWithWhereWithoutMockupInput | MockupVariantUpdateManyWithWhereWithoutMockupInput[]
    deleteMany?: MockupVariantScalarWhereInput | MockupVariantScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutMockupNestedInput = {
    create?: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput> | ProductCreateWithoutMockupInput[] | ProductUncheckedCreateWithoutMockupInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMockupInput | ProductCreateOrConnectWithoutMockupInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutMockupInput | ProductUpsertWithWhereUniqueWithoutMockupInput[]
    createMany?: ProductCreateManyMockupInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutMockupInput | ProductUpdateWithWhereUniqueWithoutMockupInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutMockupInput | ProductUpdateManyWithWhereWithoutMockupInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type MockupCreateNestedOneWithoutVariantsInput = {
    create?: XOR<MockupCreateWithoutVariantsInput, MockupUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: MockupCreateOrConnectWithoutVariantsInput
    connect?: MockupWhereUniqueInput
  }

  export type MockupUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: XOR<MockupCreateWithoutVariantsInput, MockupUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: MockupCreateOrConnectWithoutVariantsInput
    upsert?: MockupUpsertWithoutVariantsInput
    connect?: MockupWhereUniqueInput
    update?: XOR<XOR<MockupUpdateToOneWithWhereWithoutVariantsInput, MockupUpdateWithoutVariantsInput>, MockupUncheckedUpdateWithoutVariantsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumFitTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FitType | EnumFitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFitTypeFilter<$PrismaModel> | $Enums.FitType
  }

  export type NestedEnumFitTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FitType | EnumFitTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FitType[] | ListEnumFitTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFitTypeWithAggregatesFilter<$PrismaModel> | $Enums.FitType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFitTypeFilter<$PrismaModel>
    _max?: NestedEnumFitTypeFilter<$PrismaModel>
  }

  export type BrandCreateWithoutUserInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    brandCategory: BrandCategoryCreateNestedOneWithoutBrandInput
    Product?: ProductCreateNestedManyWithoutBrandInput
    Sales?: SaleCreateNestedManyWithoutBrandInput
  }

  export type BrandUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    Product?: ProductUncheckedCreateNestedManyWithoutBrandInput
    Sales?: SaleUncheckedCreateNestedManyWithoutBrandInput
  }

  export type BrandCreateOrConnectWithoutUserInput = {
    where: BrandWhereUniqueInput
    create: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput>
  }

  export type BrandCreateManyUserInputEnvelope = {
    data: BrandCreateManyUserInput | BrandCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProductCreateWithoutUserInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutUserInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutUserInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput>
  }

  export type ProductCreateManyUserInputEnvelope = {
    data: ProductCreateManyUserInput | ProductCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SaleCreateWithoutMerchantInput = {
    id?: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutSalesInput
    brand?: BrandCreateNestedOneWithoutSalesInput
  }

  export type SaleUncheckedCreateWithoutMerchantInput = {
    id?: string
    productId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type SaleCreateOrConnectWithoutMerchantInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput>
  }

  export type SaleCreateManyMerchantInputEnvelope = {
    data: SaleCreateManyMerchantInput | SaleCreateManyMerchantInput[]
    skipDuplicates?: boolean
  }

  export type MerchantProfileCreateWithoutUserInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl?: string | null
    websiteUrl?: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message?: string | null
    tiar?: number
    brandOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantProfileUncheckedCreateWithoutUserInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    contactEmail: string
    contactPhone: string
    nidOrPassportNo: string
    presentAddress: string
    permanentAddress: string
    portfolioUrl?: string | null
    websiteUrl?: string | null
    bankName: string
    bankBranch: string
    accountName: string
    accountNumber: string
    routingNumber: string
    message?: string | null
    tiar?: number
    brandOption?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantProfileCreateOrConnectWithoutUserInput = {
    where: MerchantProfileWhereUniqueInput
    create: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
  }

  export type BrandUpsertWithWhereUniqueWithoutUserInput = {
    where: BrandWhereUniqueInput
    update: XOR<BrandUpdateWithoutUserInput, BrandUncheckedUpdateWithoutUserInput>
    create: XOR<BrandCreateWithoutUserInput, BrandUncheckedCreateWithoutUserInput>
  }

  export type BrandUpdateWithWhereUniqueWithoutUserInput = {
    where: BrandWhereUniqueInput
    data: XOR<BrandUpdateWithoutUserInput, BrandUncheckedUpdateWithoutUserInput>
  }

  export type BrandUpdateManyWithWhereWithoutUserInput = {
    where: BrandScalarWhereInput
    data: XOR<BrandUpdateManyMutationInput, BrandUncheckedUpdateManyWithoutUserInput>
  }

  export type BrandScalarWhereInput = {
    AND?: BrandScalarWhereInput | BrandScalarWhereInput[]
    OR?: BrandScalarWhereInput[]
    NOT?: BrandScalarWhereInput | BrandScalarWhereInput[]
    id?: StringFilter<"Brand"> | string
    name?: StringFilter<"Brand"> | string
    isActive?: BoolFilter<"Brand"> | boolean
    createdAt?: DateTimeFilter<"Brand"> | Date | string
    updatedAt?: DateTimeFilter<"Brand"> | Date | string
    brandCategoryId?: StringFilter<"Brand"> | string
    userId?: StringFilter<"Brand"> | string
    defaultBrandPct?: FloatFilter<"Brand"> | number
    defaultMerchantPct?: FloatFilter<"Brand"> | number
  }

  export type ProductUpsertWithWhereUniqueWithoutUserInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutUserInput, ProductUncheckedUpdateWithoutUserInput>
    create: XOR<ProductCreateWithoutUserInput, ProductUncheckedCreateWithoutUserInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutUserInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutUserInput, ProductUncheckedUpdateWithoutUserInput>
  }

  export type ProductUpdateManyWithWhereWithoutUserInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutUserInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    productId?: StringFilter<"Product"> | string
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    price?: FloatFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    isActive?: BoolFilter<"Product"> | boolean
    brandName?: StringNullableFilter<"Product"> | string | null
    brandId?: StringNullableFilter<"Product"> | string | null
    mockupId?: StringFilter<"Product"> | string
    userId?: StringFilter<"Product"> | string
    visibility?: BoolFilter<"Product"> | boolean
    backDesign?: StringNullableFilter<"Product"> | string | null
    frontDesign?: StringFilter<"Product"> | string
    brandCommissionPct?: FloatNullableFilter<"Product"> | number | null
    merchantCommissionPct?: FloatNullableFilter<"Product"> | number | null
  }

  export type SaleUpsertWithWhereUniqueWithoutMerchantInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutMerchantInput, SaleUncheckedUpdateWithoutMerchantInput>
    create: XOR<SaleCreateWithoutMerchantInput, SaleUncheckedCreateWithoutMerchantInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutMerchantInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutMerchantInput, SaleUncheckedUpdateWithoutMerchantInput>
  }

  export type SaleUpdateManyWithWhereWithoutMerchantInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutMerchantInput>
  }

  export type SaleScalarWhereInput = {
    AND?: SaleScalarWhereInput | SaleScalarWhereInput[]
    OR?: SaleScalarWhereInput[]
    NOT?: SaleScalarWhereInput | SaleScalarWhereInput[]
    id?: StringFilter<"Sale"> | string
    productId?: StringFilter<"Sale"> | string
    merchantId?: StringFilter<"Sale"> | string
    brandId?: StringNullableFilter<"Sale"> | string | null
    quantity?: IntFilter<"Sale"> | number
    total?: FloatFilter<"Sale"> | number
    brandEarning?: FloatFilter<"Sale"> | number
    merchantEarning?: FloatFilter<"Sale"> | number
    platformEarning?: FloatFilter<"Sale"> | number
    createdAt?: DateTimeFilter<"Sale"> | Date | string
  }

  export type MerchantProfileUpsertWithoutUserInput = {
    update: XOR<MerchantProfileUpdateWithoutUserInput, MerchantProfileUncheckedUpdateWithoutUserInput>
    create: XOR<MerchantProfileCreateWithoutUserInput, MerchantProfileUncheckedCreateWithoutUserInput>
    where?: MerchantProfileWhereInput
  }

  export type MerchantProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: MerchantProfileWhereInput
    data: XOR<MerchantProfileUpdateWithoutUserInput, MerchantProfileUncheckedUpdateWithoutUserInput>
  }

  export type MerchantProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: StringFieldUpdateOperationsInput | string
    nidOrPassportNo?: StringFieldUpdateOperationsInput | string
    presentAddress?: StringFieldUpdateOperationsInput | string
    permanentAddress?: StringFieldUpdateOperationsInput | string
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    routingNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tiar?: IntFieldUpdateOperationsInput | number
    brandOption?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutMerchantProfileInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandCreateNestedManyWithoutUserInput
    products?: ProductCreateNestedManyWithoutUserInput
    sales?: SaleCreateNestedManyWithoutMerchantInput
  }

  export type UserUncheckedCreateWithoutMerchantProfileInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandUncheckedCreateNestedManyWithoutUserInput
    products?: ProductUncheckedCreateNestedManyWithoutUserInput
    sales?: SaleUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type UserCreateOrConnectWithoutMerchantProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMerchantProfileInput, UserUncheckedCreateWithoutMerchantProfileInput>
  }

  export type UserUpsertWithoutMerchantProfileInput = {
    update: XOR<UserUpdateWithoutMerchantProfileInput, UserUncheckedUpdateWithoutMerchantProfileInput>
    create: XOR<UserCreateWithoutMerchantProfileInput, UserUncheckedCreateWithoutMerchantProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMerchantProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMerchantProfileInput, UserUncheckedUpdateWithoutMerchantProfileInput>
  }

  export type UserUpdateWithoutMerchantProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUpdateManyWithoutUserNestedInput
    products?: ProductUpdateManyWithoutUserNestedInput
    sales?: SaleUpdateManyWithoutMerchantNestedInput
  }

  export type UserUncheckedUpdateWithoutMerchantProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUncheckedUpdateManyWithoutUserNestedInput
    products?: ProductUncheckedUpdateManyWithoutUserNestedInput
    sales?: SaleUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type BrandCategoryCreateWithoutBrandInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandCategoryUncheckedCreateWithoutBrandInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandCategoryCreateOrConnectWithoutBrandInput = {
    where: BrandCategoryWhereUniqueInput
    create: XOR<BrandCategoryCreateWithoutBrandInput, BrandCategoryUncheckedCreateWithoutBrandInput>
  }

  export type UserCreateWithoutBrandsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    products?: ProductCreateNestedManyWithoutUserInput
    sales?: SaleCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBrandsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutUserInput
    sales?: SaleUncheckedCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBrandsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBrandsInput, UserUncheckedCreateWithoutBrandsInput>
  }

  export type ProductCreateWithoutBrandInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutBrandInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutBrandInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput>
  }

  export type ProductCreateManyBrandInputEnvelope = {
    data: ProductCreateManyBrandInput | ProductCreateManyBrandInput[]
    skipDuplicates?: boolean
  }

  export type SaleCreateWithoutBrandInput = {
    id?: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutSalesInput
    merchant: UserCreateNestedOneWithoutSalesInput
  }

  export type SaleUncheckedCreateWithoutBrandInput = {
    id?: string
    productId: string
    merchantId: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type SaleCreateOrConnectWithoutBrandInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput>
  }

  export type SaleCreateManyBrandInputEnvelope = {
    data: SaleCreateManyBrandInput | SaleCreateManyBrandInput[]
    skipDuplicates?: boolean
  }

  export type BrandCategoryUpsertWithoutBrandInput = {
    update: XOR<BrandCategoryUpdateWithoutBrandInput, BrandCategoryUncheckedUpdateWithoutBrandInput>
    create: XOR<BrandCategoryCreateWithoutBrandInput, BrandCategoryUncheckedCreateWithoutBrandInput>
    where?: BrandCategoryWhereInput
  }

  export type BrandCategoryUpdateToOneWithWhereWithoutBrandInput = {
    where?: BrandCategoryWhereInput
    data: XOR<BrandCategoryUpdateWithoutBrandInput, BrandCategoryUncheckedUpdateWithoutBrandInput>
  }

  export type BrandCategoryUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCategoryUncheckedUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutBrandsInput = {
    update: XOR<UserUpdateWithoutBrandsInput, UserUncheckedUpdateWithoutBrandsInput>
    create: XOR<UserCreateWithoutBrandsInput, UserUncheckedCreateWithoutBrandsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBrandsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBrandsInput, UserUncheckedUpdateWithoutBrandsInput>
  }

  export type UserUpdateWithoutBrandsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutUserNestedInput
    sales?: SaleUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBrandsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutUserNestedInput
    sales?: SaleUncheckedUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ProductUpsertWithWhereUniqueWithoutBrandInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutBrandInput, ProductUncheckedUpdateWithoutBrandInput>
    create: XOR<ProductCreateWithoutBrandInput, ProductUncheckedCreateWithoutBrandInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutBrandInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutBrandInput, ProductUncheckedUpdateWithoutBrandInput>
  }

  export type ProductUpdateManyWithWhereWithoutBrandInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutBrandInput>
  }

  export type SaleUpsertWithWhereUniqueWithoutBrandInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutBrandInput, SaleUncheckedUpdateWithoutBrandInput>
    create: XOR<SaleCreateWithoutBrandInput, SaleUncheckedCreateWithoutBrandInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutBrandInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutBrandInput, SaleUncheckedUpdateWithoutBrandInput>
  }

  export type SaleUpdateManyWithWhereWithoutBrandInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutBrandInput>
  }

  export type BrandCreateWithoutBrandCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    user: UserCreateNestedOneWithoutBrandsInput
    Product?: ProductCreateNestedManyWithoutBrandInput
    Sales?: SaleCreateNestedManyWithoutBrandInput
  }

  export type BrandUncheckedCreateWithoutBrandCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    Product?: ProductUncheckedCreateNestedManyWithoutBrandInput
    Sales?: SaleUncheckedCreateNestedManyWithoutBrandInput
  }

  export type BrandCreateOrConnectWithoutBrandCategoryInput = {
    where: BrandWhereUniqueInput
    create: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput>
  }

  export type BrandCreateManyBrandCategoryInputEnvelope = {
    data: BrandCreateManyBrandCategoryInput | BrandCreateManyBrandCategoryInput[]
    skipDuplicates?: boolean
  }

  export type BrandUpsertWithWhereUniqueWithoutBrandCategoryInput = {
    where: BrandWhereUniqueInput
    update: XOR<BrandUpdateWithoutBrandCategoryInput, BrandUncheckedUpdateWithoutBrandCategoryInput>
    create: XOR<BrandCreateWithoutBrandCategoryInput, BrandUncheckedCreateWithoutBrandCategoryInput>
  }

  export type BrandUpdateWithWhereUniqueWithoutBrandCategoryInput = {
    where: BrandWhereUniqueInput
    data: XOR<BrandUpdateWithoutBrandCategoryInput, BrandUncheckedUpdateWithoutBrandCategoryInput>
  }

  export type BrandUpdateManyWithWhereWithoutBrandCategoryInput = {
    where: BrandScalarWhereInput
    data: XOR<BrandUpdateManyMutationInput, BrandUncheckedUpdateManyWithoutBrandCategoryInput>
  }

  export type BrandCreateWithoutProductInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    brandCategory: BrandCategoryCreateNestedOneWithoutBrandInput
    user: UserCreateNestedOneWithoutBrandsInput
    Sales?: SaleCreateNestedManyWithoutBrandInput
  }

  export type BrandUncheckedCreateWithoutProductInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    Sales?: SaleUncheckedCreateNestedManyWithoutBrandInput
  }

  export type BrandCreateOrConnectWithoutProductInput = {
    where: BrandWhereUniqueInput
    create: XOR<BrandCreateWithoutProductInput, BrandUncheckedCreateWithoutProductInput>
  }

  export type FeatureCreateWithoutProductInput = {
    id?: string
    content: string
  }

  export type FeatureUncheckedCreateWithoutProductInput = {
    id?: string
    content: string
  }

  export type FeatureCreateOrConnectWithoutProductInput = {
    where: FeatureWhereUniqueInput
    create: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput>
  }

  export type FeatureCreateManyProductInputEnvelope = {
    data: FeatureCreateManyProductInput | FeatureCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type TagCreateWithoutProductInput = {
    id?: string
    value: string
  }

  export type TagUncheckedCreateWithoutProductInput = {
    id?: string
    value: string
  }

  export type TagCreateOrConnectWithoutProductInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput>
  }

  export type TagCreateManyProductInputEnvelope = {
    data: TagCreateManyProductInput | TagCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type MockupCreateWithoutProductInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: MockupVariantCreateNestedManyWithoutMockupInput
  }

  export type MockupUncheckedCreateWithoutProductInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: MockupVariantUncheckedCreateNestedManyWithoutMockupInput
  }

  export type MockupCreateOrConnectWithoutProductInput = {
    where: MockupWhereUniqueInput
    create: XOR<MockupCreateWithoutProductInput, MockupUncheckedCreateWithoutProductInput>
  }

  export type ProductVariantCreateWithoutProductInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
  }

  export type ProductVariantUncheckedCreateWithoutProductInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
  }

  export type ProductVariantCreateOrConnectWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    create: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductVariantCreateManyProductInputEnvelope = {
    data: ProductVariantCreateManyProductInput | ProductVariantCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutProductsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandCreateNestedManyWithoutUserInput
    sales?: SaleCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProductsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandUncheckedCreateNestedManyWithoutUserInput
    sales?: SaleUncheckedCreateNestedManyWithoutMerchantInput
    merchantProfile?: MerchantProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProductsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
  }

  export type SaleCreateWithoutProductInput = {
    id?: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
    merchant: UserCreateNestedOneWithoutSalesInput
    brand?: BrandCreateNestedOneWithoutSalesInput
  }

  export type SaleUncheckedCreateWithoutProductInput = {
    id?: string
    merchantId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type SaleCreateOrConnectWithoutProductInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput>
  }

  export type SaleCreateManyProductInputEnvelope = {
    data: SaleCreateManyProductInput | SaleCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type BrandUpsertWithoutProductInput = {
    update: XOR<BrandUpdateWithoutProductInput, BrandUncheckedUpdateWithoutProductInput>
    create: XOR<BrandCreateWithoutProductInput, BrandUncheckedCreateWithoutProductInput>
    where?: BrandWhereInput
  }

  export type BrandUpdateToOneWithWhereWithoutProductInput = {
    where?: BrandWhereInput
    data: XOR<BrandUpdateWithoutProductInput, BrandUncheckedUpdateWithoutProductInput>
  }

  export type BrandUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    brandCategory?: BrandCategoryUpdateOneRequiredWithoutBrandNestedInput
    user?: UserUpdateOneRequiredWithoutBrandsNestedInput
    Sales?: SaleUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    Sales?: SaleUncheckedUpdateManyWithoutBrandNestedInput
  }

  export type FeatureUpsertWithWhereUniqueWithoutProductInput = {
    where: FeatureWhereUniqueInput
    update: XOR<FeatureUpdateWithoutProductInput, FeatureUncheckedUpdateWithoutProductInput>
    create: XOR<FeatureCreateWithoutProductInput, FeatureUncheckedCreateWithoutProductInput>
  }

  export type FeatureUpdateWithWhereUniqueWithoutProductInput = {
    where: FeatureWhereUniqueInput
    data: XOR<FeatureUpdateWithoutProductInput, FeatureUncheckedUpdateWithoutProductInput>
  }

  export type FeatureUpdateManyWithWhereWithoutProductInput = {
    where: FeatureScalarWhereInput
    data: XOR<FeatureUpdateManyMutationInput, FeatureUncheckedUpdateManyWithoutProductInput>
  }

  export type FeatureScalarWhereInput = {
    AND?: FeatureScalarWhereInput | FeatureScalarWhereInput[]
    OR?: FeatureScalarWhereInput[]
    NOT?: FeatureScalarWhereInput | FeatureScalarWhereInput[]
    id?: StringFilter<"Feature"> | string
    productId?: StringFilter<"Feature"> | string
    content?: StringFilter<"Feature"> | string
  }

  export type TagUpsertWithWhereUniqueWithoutProductInput = {
    where: TagWhereUniqueInput
    update: XOR<TagUpdateWithoutProductInput, TagUncheckedUpdateWithoutProductInput>
    create: XOR<TagCreateWithoutProductInput, TagUncheckedCreateWithoutProductInput>
  }

  export type TagUpdateWithWhereUniqueWithoutProductInput = {
    where: TagWhereUniqueInput
    data: XOR<TagUpdateWithoutProductInput, TagUncheckedUpdateWithoutProductInput>
  }

  export type TagUpdateManyWithWhereWithoutProductInput = {
    where: TagScalarWhereInput
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyWithoutProductInput>
  }

  export type TagScalarWhereInput = {
    AND?: TagScalarWhereInput | TagScalarWhereInput[]
    OR?: TagScalarWhereInput[]
    NOT?: TagScalarWhereInput | TagScalarWhereInput[]
    id?: StringFilter<"Tag"> | string
    productId?: StringFilter<"Tag"> | string
    value?: StringFilter<"Tag"> | string
  }

  export type MockupUpsertWithoutProductInput = {
    update: XOR<MockupUpdateWithoutProductInput, MockupUncheckedUpdateWithoutProductInput>
    create: XOR<MockupCreateWithoutProductInput, MockupUncheckedCreateWithoutProductInput>
    where?: MockupWhereInput
  }

  export type MockupUpdateToOneWithWhereWithoutProductInput = {
    where?: MockupWhereInput
    data: XOR<MockupUpdateWithoutProductInput, MockupUncheckedUpdateWithoutProductInput>
  }

  export type MockupUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: MockupVariantUpdateManyWithoutMockupNestedInput
  }

  export type MockupUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: MockupVariantUncheckedUpdateManyWithoutMockupNestedInput
  }

  export type ProductVariantUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    update: XOR<ProductVariantUpdateWithoutProductInput, ProductVariantUncheckedUpdateWithoutProductInput>
    create: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductVariantUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    data: XOR<ProductVariantUpdateWithoutProductInput, ProductVariantUncheckedUpdateWithoutProductInput>
  }

  export type ProductVariantUpdateManyWithWhereWithoutProductInput = {
    where: ProductVariantScalarWhereInput
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductVariantScalarWhereInput = {
    AND?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
    OR?: ProductVariantScalarWhereInput[]
    NOT?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
    id?: StringFilter<"ProductVariant"> | string
    productId?: StringFilter<"ProductVariant"> | string
    color?: StringFilter<"ProductVariant"> | string
    fitType?: EnumFitTypeFilter<"ProductVariant"> | $Enums.FitType
    frontImg?: StringFilter<"ProductVariant"> | string
    backImg?: StringNullableFilter<"ProductVariant"> | string | null
  }

  export type UserUpsertWithoutProductsInput = {
    update: XOR<UserUpdateWithoutProductsInput, UserUncheckedUpdateWithoutProductsInput>
    create: XOR<UserCreateWithoutProductsInput, UserUncheckedCreateWithoutProductsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProductsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProductsInput, UserUncheckedUpdateWithoutProductsInput>
  }

  export type UserUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUpdateManyWithoutUserNestedInput
    sales?: SaleUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUncheckedUpdateManyWithoutUserNestedInput
    sales?: SaleUncheckedUpdateManyWithoutMerchantNestedInput
    merchantProfile?: MerchantProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type SaleUpsertWithWhereUniqueWithoutProductInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutProductInput, SaleUncheckedUpdateWithoutProductInput>
    create: XOR<SaleCreateWithoutProductInput, SaleUncheckedCreateWithoutProductInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutProductInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutProductInput, SaleUncheckedUpdateWithoutProductInput>
  }

  export type SaleUpdateManyWithWhereWithoutProductInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductCreateWithoutSalesInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutSalesInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSalesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSalesInput, ProductUncheckedCreateWithoutSalesInput>
  }

  export type UserCreateWithoutSalesInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandCreateNestedManyWithoutUserInput
    products?: ProductCreateNestedManyWithoutUserInput
    merchantProfile?: MerchantProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSalesInput = {
    id?: string
    email?: string | null
    phone?: string | null
    name: string
    password: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brands?: BrandUncheckedCreateNestedManyWithoutUserInput
    products?: ProductUncheckedCreateNestedManyWithoutUserInput
    merchantProfile?: MerchantProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSalesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
  }

  export type BrandCreateWithoutSalesInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    brandCategory: BrandCategoryCreateNestedOneWithoutBrandInput
    user: UserCreateNestedOneWithoutBrandsInput
    Product?: ProductCreateNestedManyWithoutBrandInput
  }

  export type BrandUncheckedCreateWithoutSalesInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
    Product?: ProductUncheckedCreateNestedManyWithoutBrandInput
  }

  export type BrandCreateOrConnectWithoutSalesInput = {
    where: BrandWhereUniqueInput
    create: XOR<BrandCreateWithoutSalesInput, BrandUncheckedCreateWithoutSalesInput>
  }

  export type ProductUpsertWithoutSalesInput = {
    update: XOR<ProductUpdateWithoutSalesInput, ProductUncheckedUpdateWithoutSalesInput>
    create: XOR<ProductCreateWithoutSalesInput, ProductUncheckedCreateWithoutSalesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutSalesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutSalesInput, ProductUncheckedUpdateWithoutSalesInput>
  }

  export type ProductUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type UserUpsertWithoutSalesInput = {
    update: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSalesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
  }

  export type UserUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUpdateManyWithoutUserNestedInput
    products?: ProductUpdateManyWithoutUserNestedInput
    merchantProfile?: MerchantProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brands?: BrandUncheckedUpdateManyWithoutUserNestedInput
    products?: ProductUncheckedUpdateManyWithoutUserNestedInput
    merchantProfile?: MerchantProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type BrandUpsertWithoutSalesInput = {
    update: XOR<BrandUpdateWithoutSalesInput, BrandUncheckedUpdateWithoutSalesInput>
    create: XOR<BrandCreateWithoutSalesInput, BrandUncheckedCreateWithoutSalesInput>
    where?: BrandWhereInput
  }

  export type BrandUpdateToOneWithWhereWithoutSalesInput = {
    where?: BrandWhereInput
    data: XOR<BrandUpdateWithoutSalesInput, BrandUncheckedUpdateWithoutSalesInput>
  }

  export type BrandUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    brandCategory?: BrandCategoryUpdateOneRequiredWithoutBrandNestedInput
    user?: UserUpdateOneRequiredWithoutBrandsNestedInput
    Product?: ProductUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    Product?: ProductUncheckedUpdateManyWithoutBrandNestedInput
  }

  export type ProductCreateWithoutVariantsInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutVariantsInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutVariantsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
  }

  export type ProductUpsertWithoutVariantsInput = {
    update: XOR<ProductUpdateWithoutVariantsInput, ProductUncheckedUpdateWithoutVariantsInput>
    create: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutVariantsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutVariantsInput, ProductUncheckedUpdateWithoutVariantsInput>
  }

  export type ProductUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutFeaturesInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutFeaturesInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutFeaturesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutFeaturesInput, ProductUncheckedCreateWithoutFeaturesInput>
  }

  export type ProductUpsertWithoutFeaturesInput = {
    update: XOR<ProductUpdateWithoutFeaturesInput, ProductUncheckedUpdateWithoutFeaturesInput>
    create: XOR<ProductCreateWithoutFeaturesInput, ProductUncheckedCreateWithoutFeaturesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutFeaturesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutFeaturesInput, ProductUncheckedUpdateWithoutFeaturesInput>
  }

  export type ProductUpdateWithoutFeaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutFeaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutTagsInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    Mockup: MockupCreateNestedOneWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutTagsInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutTagsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutTagsInput, ProductUncheckedCreateWithoutTagsInput>
  }

  export type ProductUpsertWithoutTagsInput = {
    update: XOR<ProductUpdateWithoutTagsInput, ProductUncheckedUpdateWithoutTagsInput>
    create: XOR<ProductCreateWithoutTagsInput, ProductUncheckedCreateWithoutTagsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutTagsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutTagsInput, ProductUncheckedUpdateWithoutTagsInput>
  }

  export type ProductUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type MockupVariantCreateWithoutMockupInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
  }

  export type MockupVariantUncheckedCreateWithoutMockupInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
  }

  export type MockupVariantCreateOrConnectWithoutMockupInput = {
    where: MockupVariantWhereUniqueInput
    create: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput>
  }

  export type MockupVariantCreateManyMockupInputEnvelope = {
    data: MockupVariantCreateManyMockupInput | MockupVariantCreateManyMockupInput[]
    skipDuplicates?: boolean
  }

  export type ProductCreateWithoutMockupInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    Brand?: BrandCreateNestedOneWithoutProductInput
    features?: FeatureCreateNestedManyWithoutProductInput
    tags?: TagCreateNestedManyWithoutProductInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    User: UserCreateNestedOneWithoutProductsInput
    sales?: SaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutMockupInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
    features?: FeatureUncheckedCreateNestedManyWithoutProductInput
    tags?: TagUncheckedCreateNestedManyWithoutProductInput
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
    sales?: SaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutMockupInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput>
  }

  export type ProductCreateManyMockupInputEnvelope = {
    data: ProductCreateManyMockupInput | ProductCreateManyMockupInput[]
    skipDuplicates?: boolean
  }

  export type MockupVariantUpsertWithWhereUniqueWithoutMockupInput = {
    where: MockupVariantWhereUniqueInput
    update: XOR<MockupVariantUpdateWithoutMockupInput, MockupVariantUncheckedUpdateWithoutMockupInput>
    create: XOR<MockupVariantCreateWithoutMockupInput, MockupVariantUncheckedCreateWithoutMockupInput>
  }

  export type MockupVariantUpdateWithWhereUniqueWithoutMockupInput = {
    where: MockupVariantWhereUniqueInput
    data: XOR<MockupVariantUpdateWithoutMockupInput, MockupVariantUncheckedUpdateWithoutMockupInput>
  }

  export type MockupVariantUpdateManyWithWhereWithoutMockupInput = {
    where: MockupVariantScalarWhereInput
    data: XOR<MockupVariantUpdateManyMutationInput, MockupVariantUncheckedUpdateManyWithoutMockupInput>
  }

  export type MockupVariantScalarWhereInput = {
    AND?: MockupVariantScalarWhereInput | MockupVariantScalarWhereInput[]
    OR?: MockupVariantScalarWhereInput[]
    NOT?: MockupVariantScalarWhereInput | MockupVariantScalarWhereInput[]
    id?: StringFilter<"MockupVariant"> | string
    mockupId?: StringFilter<"MockupVariant"> | string
    color?: StringFilter<"MockupVariant"> | string
    fitType?: EnumFitTypeFilter<"MockupVariant"> | $Enums.FitType
    frontImg?: StringFilter<"MockupVariant"> | string
    backImg?: StringFilter<"MockupVariant"> | string
  }

  export type ProductUpsertWithWhereUniqueWithoutMockupInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutMockupInput, ProductUncheckedUpdateWithoutMockupInput>
    create: XOR<ProductCreateWithoutMockupInput, ProductUncheckedCreateWithoutMockupInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutMockupInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutMockupInput, ProductUncheckedUpdateWithoutMockupInput>
  }

  export type ProductUpdateManyWithWhereWithoutMockupInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutMockupInput>
  }

  export type MockupCreateWithoutVariantsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Product?: ProductCreateNestedManyWithoutMockupInput
  }

  export type MockupUncheckedCreateWithoutVariantsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Product?: ProductUncheckedCreateNestedManyWithoutMockupInput
  }

  export type MockupCreateOrConnectWithoutVariantsInput = {
    where: MockupWhereUniqueInput
    create: XOR<MockupCreateWithoutVariantsInput, MockupUncheckedCreateWithoutVariantsInput>
  }

  export type MockupUpsertWithoutVariantsInput = {
    update: XOR<MockupUpdateWithoutVariantsInput, MockupUncheckedUpdateWithoutVariantsInput>
    create: XOR<MockupCreateWithoutVariantsInput, MockupUncheckedCreateWithoutVariantsInput>
    where?: MockupWhereInput
  }

  export type MockupUpdateToOneWithWhereWithoutVariantsInput = {
    where?: MockupWhereInput
    data: XOR<MockupUpdateWithoutVariantsInput, MockupUncheckedUpdateWithoutVariantsInput>
  }

  export type MockupUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Product?: ProductUpdateManyWithoutMockupNestedInput
  }

  export type MockupUncheckedUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Product?: ProductUncheckedUpdateManyWithoutMockupNestedInput
  }

  export type BrandCreateManyUserInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brandCategoryId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
  }

  export type ProductCreateManyUserInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    mockupId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
  }

  export type SaleCreateManyMerchantInput = {
    id?: string
    productId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type BrandUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    brandCategory?: BrandCategoryUpdateOneRequiredWithoutBrandNestedInput
    Product?: ProductUpdateManyWithoutBrandNestedInput
    Sales?: SaleUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    Product?: ProductUncheckedUpdateManyWithoutBrandNestedInput
    Sales?: SaleUncheckedUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brandCategoryId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
  }

  export type ProductUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type SaleUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSalesNestedInput
    brand?: BrandUpdateOneWithoutSalesNestedInput
  }

  export type SaleUncheckedUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateManyBrandInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    mockupId: string
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
  }

  export type SaleCreateManyBrandInput = {
    id?: string
    productId: string
    merchantId: string
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type ProductUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    Mockup?: MockupUpdateOneRequiredWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    mockupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type SaleUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSalesNestedInput
    merchant?: UserUpdateOneRequiredWithoutSalesNestedInput
  }

  export type SaleUncheckedUpdateWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyWithoutBrandInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCreateManyBrandCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    defaultBrandPct?: number
    defaultMerchantPct?: number
  }

  export type BrandUpdateWithoutBrandCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutBrandsNestedInput
    Product?: ProductUpdateManyWithoutBrandNestedInput
    Sales?: SaleUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateWithoutBrandCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
    Product?: ProductUncheckedUpdateManyWithoutBrandNestedInput
    Sales?: SaleUncheckedUpdateManyWithoutBrandNestedInput
  }

  export type BrandUncheckedUpdateManyWithoutBrandCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    defaultBrandPct?: FloatFieldUpdateOperationsInput | number
    defaultMerchantPct?: FloatFieldUpdateOperationsInput | number
  }

  export type FeatureCreateManyProductInput = {
    id?: string
    content: string
  }

  export type TagCreateManyProductInput = {
    id?: string
    value: string
  }

  export type ProductVariantCreateManyProductInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg?: string | null
  }

  export type SaleCreateManyProductInput = {
    id?: string
    merchantId: string
    brandId?: string | null
    quantity?: number
    total: number
    brandEarning?: number
    merchantEarning?: number
    platformEarning?: number
    createdAt?: Date | string
  }

  export type FeatureUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type FeatureUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type FeatureUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type TagUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type TagUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type TagUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type ProductVariantUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductVariantUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductVariantUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SaleUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    merchant?: UserUpdateOneRequiredWithoutSalesNestedInput
    brand?: BrandUpdateOneWithoutSalesNestedInput
  }

  export type SaleUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    brandEarning?: FloatFieldUpdateOperationsInput | number
    merchantEarning?: FloatFieldUpdateOperationsInput | number
    platformEarning?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockupVariantCreateManyMockupInput = {
    id?: string
    color: string
    fitType: $Enums.FitType
    frontImg: string
    backImg: string
  }

  export type ProductCreateManyMockupInput = {
    id?: string
    productId: string
    title: string
    description?: string | null
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    brandName?: string | null
    brandId?: string | null
    userId: string
    visibility?: boolean
    backDesign?: string | null
    frontDesign: string
    brandCommissionPct?: number | null
    merchantCommissionPct?: number | null
  }

  export type MockupVariantUpdateWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type MockupVariantUncheckedUpdateWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type MockupVariantUncheckedUpdateManyWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fitType?: EnumFitTypeFieldUpdateOperationsInput | $Enums.FitType
    frontImg?: StringFieldUpdateOperationsInput | string
    backImg?: StringFieldUpdateOperationsInput | string
  }

  export type ProductUpdateWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    Brand?: BrandUpdateOneWithoutProductNestedInput
    features?: FeatureUpdateManyWithoutProductNestedInput
    tags?: TagUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    User?: UserUpdateOneRequiredWithoutProductsNestedInput
    sales?: SaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    features?: FeatureUncheckedUpdateManyWithoutProductNestedInput
    tags?: TagUncheckedUpdateManyWithoutProductNestedInput
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
    sales?: SaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutMockupInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    brandName?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    visibility?: BoolFieldUpdateOperationsInput | boolean
    backDesign?: NullableStringFieldUpdateOperationsInput | string | null
    frontDesign?: StringFieldUpdateOperationsInput | string
    brandCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
    merchantCommissionPct?: NullableFloatFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}