/* eslint-disable */
// @ts-nocheck
import { GraphQLContext } from '../IContext';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Account = Node & {
  __typename?: 'Account';
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['Int'];
  sessions?: Maybe<Array<AccountSession>>;
  status: AccountStatus;
  updatedAt: Scalars['Date'];
};

export type AccountSession = Node & {
  __typename?: 'AccountSession';
  account: Account;
  address?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  expiresAt: Scalars['Date'];
  id: Scalars['Int'];
  ipAddr: Scalars['String'];
  updatedAt: Scalars['Date'];
  userAgent?: Maybe<UserAgent>;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED'
}

export type AuthResult = {
  __typename?: 'AuthResult';
  account: Account;
  token: Scalars['String'];
};

export type CostComplexity = {
  max?: InputMaybe<Scalars['Int']>;
  min?: InputMaybe<Scalars['Int']>;
};

export type GenerateEmailCodeResult = {
  __typename?: 'GenerateEmailCodeResult';
  expiresAt: Scalars['Date'];
  result: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateAccount: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  echo: Scalars['String'];
  generateEmailCode: GenerateEmailCodeResult;
  login: AuthResult;
  logout: Scalars['Boolean'];
  register: AuthResult;
  resetPassword: Scalars['Boolean'];
};


export type MutationActivateAccountArgs = {
  code: Scalars['String'];
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationEchoArgs = {
  text: Scalars['String'];
};


export type MutationGenerateEmailCodeArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLogoutArgs = {
  sessionIds?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String'];
  emailCode: Scalars['String'];
  newPassword: Scalars['String'];
};

export type Node = {
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  updatedAt: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  currentSession: AccountSession;
  echo: Scalars['String'];
  error?: Maybe<Scalars['Int']>;
  whoami: Account;
};


export type QueryEchoArgs = {
  text: Scalars['String'];
};

export type UserAgent = {
  __typename?: 'UserAgent';
  browser?: Maybe<UserAgentBrowser>;
  cpu?: Maybe<UserAgentCpu>;
  engine?: Maybe<UserAgentEngine>;
  os?: Maybe<UserAgentOs>;
  ua?: Maybe<Scalars['String']>;
};

export type UserAgentBrowser = {
  __typename?: 'UserAgentBrowser';
  major?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type UserAgentCpu = {
  __typename?: 'UserAgentCpu';
  architecture?: Maybe<Scalars['String']>;
};

export type UserAgentEngine = {
  __typename?: 'UserAgentEngine';
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type UserAgentOs = {
  __typename?: 'UserAgentOs';
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Account: ResolverTypeWrapper<Partial<Account>>;
  AccountSession: ResolverTypeWrapper<Partial<AccountSession>>;
  AccountStatus: ResolverTypeWrapper<Partial<AccountStatus>>;
  AuthResult: ResolverTypeWrapper<Partial<AuthResult>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  CostComplexity: ResolverTypeWrapper<Partial<CostComplexity>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']>>;
  GenerateEmailCodeResult: ResolverTypeWrapper<Partial<GenerateEmailCodeResult>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Account'] | ResolversTypes['AccountSession'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  UserAgent: ResolverTypeWrapper<Partial<UserAgent>>;
  UserAgentBrowser: ResolverTypeWrapper<Partial<UserAgentBrowser>>;
  UserAgentCpu: ResolverTypeWrapper<Partial<UserAgentCpu>>;
  UserAgentEngine: ResolverTypeWrapper<Partial<UserAgentEngine>>;
  UserAgentOs: ResolverTypeWrapper<Partial<UserAgentOs>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Partial<Account>;
  AccountSession: Partial<AccountSession>;
  AuthResult: Partial<AuthResult>;
  Boolean: Partial<Scalars['Boolean']>;
  CostComplexity: Partial<CostComplexity>;
  Date: Partial<Scalars['Date']>;
  GenerateEmailCodeResult: Partial<GenerateEmailCodeResult>;
  Int: Partial<Scalars['Int']>;
  Mutation: {};
  Node: ResolversParentTypes['Account'] | ResolversParentTypes['AccountSession'];
  Query: {};
  String: Partial<Scalars['String']>;
  UserAgent: Partial<UserAgent>;
  UserAgentBrowser: Partial<UserAgentBrowser>;
  UserAgentCpu: Partial<UserAgentCpu>;
  UserAgentEngine: Partial<UserAgentEngine>;
  UserAgentOs: Partial<UserAgentOs>;
}>;

export type CostDirectiveArgs = {
  complexity?: Maybe<CostComplexity>;
  multipliers?: Maybe<Array<Maybe<Scalars['String']>>>;
  useMultipliers?: Maybe<Scalars['Boolean']>;
};

export type CostDirectiveResolver<Result, Parent, ContextType = GraphQLContext, Args = CostDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sessions?: Resolver<Maybe<Array<ResolversTypes['AccountSession']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AccountStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AccountSession'] = ResolversParentTypes['AccountSession']> = ResolversObject<{
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ipAddr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  userAgent?: Resolver<Maybe<ResolversTypes['UserAgent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthResult'] = ResolversParentTypes['AuthResult']> = ResolversObject<{
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GenerateEmailCodeResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateEmailCodeResult'] = ResolversParentTypes['GenerateEmailCodeResult']> = ResolversObject<{
  expiresAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  activateAccount?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'code' | 'email'>>;
  changePassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'password'>>;
  echo?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationEchoArgs, 'text'>>;
  generateEmailCode?: Resolver<ResolversTypes['GenerateEmailCodeResult'], ParentType, ContextType, RequireFields<MutationGenerateEmailCodeArgs, 'email'>>;
  login?: Resolver<ResolversTypes['AuthResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLogoutArgs, never>>;
  register?: Resolver<ResolversTypes['AuthResult'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'password'>>;
  resetPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email' | 'emailCode' | 'newPassword'>>;
}>;

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Account' | 'AccountSession', ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  currentSession?: Resolver<ResolversTypes['AccountSession'], ParentType, ContextType>;
  echo?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryEchoArgs, 'text'>>;
  error?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  whoami?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
}>;

export type UserAgentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAgent'] = ResolversParentTypes['UserAgent']> = ResolversObject<{
  browser?: Resolver<Maybe<ResolversTypes['UserAgentBrowser']>, ParentType, ContextType>;
  cpu?: Resolver<Maybe<ResolversTypes['UserAgentCpu']>, ParentType, ContextType>;
  engine?: Resolver<Maybe<ResolversTypes['UserAgentEngine']>, ParentType, ContextType>;
  os?: Resolver<Maybe<ResolversTypes['UserAgentOs']>, ParentType, ContextType>;
  ua?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAgentBrowserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAgentBrowser'] = ResolversParentTypes['UserAgentBrowser']> = ResolversObject<{
  major?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAgentCpuResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAgentCpu'] = ResolversParentTypes['UserAgentCpu']> = ResolversObject<{
  architecture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAgentEngineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAgentEngine'] = ResolversParentTypes['UserAgentEngine']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAgentOsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAgentOs'] = ResolversParentTypes['UserAgentOs']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountSession?: AccountSessionResolvers<ContextType>;
  AuthResult?: AuthResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  GenerateEmailCodeResult?: GenerateEmailCodeResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UserAgent?: UserAgentResolvers<ContextType>;
  UserAgentBrowser?: UserAgentBrowserResolvers<ContextType>;
  UserAgentCpu?: UserAgentCpuResolvers<ContextType>;
  UserAgentEngine?: UserAgentEngineResolvers<ContextType>;
  UserAgentOs?: UserAgentOsResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = GraphQLContext> = ResolversObject<{
  cost?: CostDirectiveResolver<any, any, ContextType>;
}>;
