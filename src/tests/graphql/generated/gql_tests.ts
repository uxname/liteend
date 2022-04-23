/* eslint-disable */
// @ts-nocheck
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Json: any;
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
  debug?: Maybe<Scalars['Json']>;
  error?: Maybe<Scalars['Int']>;
  whoami: Account;
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

export type MyEchoMutationVariables = Exact<{
  text: Scalars['String'];
}>;


export type MyEchoMutation = { __typename?: 'Mutation', echo: string };


export const MyEchoDocument = gql`
    mutation MyEcho($text: String!) {
  echo(text: $text)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    MyEcho(variables: MyEchoMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyEchoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyEchoMutation>(MyEchoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyEcho', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;