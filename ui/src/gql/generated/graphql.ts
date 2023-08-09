/* eslint-disable */
// @ts-ignore
import { useQuery, useInfiniteQuery, useMutation, UseQueryOptions, UseInfiniteQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '../fetcher';
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
  DateTime: any;
  Map: any;
  NotificationMetadata: any;
  Price: any;
};

export type AwsPresignedPost = {
  __typename?: 'AWSPresignedPost';
  fields: Scalars['Map'];
  url: Scalars['String'];
};

export type AdminCreateUserInput = {
  address: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  role: Role;
  twitter?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type AdminUpdateUserInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Role>;
  twitter?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type AppConfig = {
  __typename?: 'AppConfig';
  allowlist?: Maybe<Scalars['String']>;
  allowlistPackage?: Maybe<Scalars['String']>;
  authlistPackage?: Maybe<Scalars['String']>;
  commissionAddress?: Maybe<Scalars['String']>;
  commissionBps?: Maybe<Scalars['String']>;
  dappPackage?: Maybe<Scalars['String']>;
  dappPackages?: Maybe<Array<Scalars['String']>>;
  explorerRpc?: Maybe<Scalars['String']>;
  koiskPackage?: Maybe<Scalars['String']>;
  launchpadPackage?: Maybe<Scalars['String']>;
  launchpadV2Package?: Maybe<Scalars['String']>;
  liquidityLayerPackage?: Maybe<Scalars['String']>;
  liquidityLayerV1Package?: Maybe<Scalars['String']>;
  network?: Maybe<Scalars['String']>;
  nftProtocolPackage?: Maybe<Scalars['String']>;
  permissionPackage?: Maybe<Scalars['String']>;
  privateRpc?: Maybe<Scalars['String']>;
  requestPackage?: Maybe<Scalars['String']>;
  rpc?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  wsRpc?: Maybe<Scalars['String']>;
};

export type Candlestick = {
  __typename?: 'Candlestick';
  c: Scalars['Float'];
  h: Scalars['Float'];
  l: Scalars['Float'];
  o: Scalars['Float'];
  ts: Scalars['Float'];
  v: Scalars['Float'];
};

export type Collection = {
  __typename?: 'Collection';
  address: Scalars['ID'];
  attributes: Array<CollectionAttribute>;
  bpsRoyaltyStrategy?: Maybe<Scalars['String']>;
  collectionBidStats: CollectionBidStats;
  collectionObject?: Maybe<Scalars['String']>;
  coverUrl?: Maybe<Scalars['String']>;
  creators?: Maybe<Array<Maybe<Creator>>>;
  description?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  myCollecitonBid: Array<CollectionBid>;
  name: Scalars['String'];
  orderbook?: Maybe<Scalars['String']>;
  orderbookType?: Maybe<OrderbookType>;
  /** @deprecated Use type */
  packageModule?: Maybe<Scalars['String']>;
  royalty?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  /** @deprecated Use orderbook and orderbookType */
  somisOrderbook?: Maybe<Scalars['String']>;
  stats?: Maybe<CollectionStats>;
  transferAllowlist?: Maybe<Scalars['String']>;
  transferPolicy?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
  website?: Maybe<Scalars['String']>;
  whitelisted?: Maybe<Scalars['Boolean']>;
  withdrawPolicy?: Maybe<Scalars['String']>;
};

export type CollectionAttribute = {
  __typename?: 'CollectionAttribute';
  name?: Maybe<Scalars['String']>;
  values: Array<NftAttribute>;
};

export type CollectionBid = {
  __typename?: 'CollectionBid';
  bidder: User;
  bidderKiosk?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  price: Scalars['Price'];
};

export type CollectionBidStats = {
  __typename?: 'CollectionBidStats';
  items: Array<CollectionBidStatsItem>;
};

export type CollectionBidStatsItem = {
  __typename?: 'CollectionBidStatsItem';
  numberOfBid: Scalars['Int'];
  owner: Scalars['Int'];
  price: Scalars['String'];
};

export type CollectionChartDataInput = {
  address: Scalars['String'];
  from: Scalars['DateTime'];
  interval: Scalars['Int'];
  intervalUnit: IntervalUnit;
  to: Scalars['DateTime'];
};

export type CollectionFilterInput = {
  keyword?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
};

export type CollectionScatterChartData = {
  __typename?: 'CollectionScatterChartData';
  p: Scalars['Float'];
  ts: Scalars['Float'];
};

export type CollectionScatterChartDataInput = {
  address: Scalars['String'];
  from: Scalars['DateTime'];
  to: Scalars['DateTime'];
};

export enum CollectionSortingFields {
  Floor = 'FLOOR',
  Name = 'NAME',
  TotalItems = 'TOTAL_ITEMS',
  TotalVol = 'TOTAL_VOL',
  Vol24 = 'VOL24',
  Vol24Delta = 'VOL24_DELTA'
}

export type CollectionSortingInput = {
  field?: InputMaybe<CollectionSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type CollectionStats = {
  __typename?: 'CollectionStats';
  floor?: Maybe<Scalars['String']>;
  listedItem: Scalars['Int'];
  owners: Scalars['Int'];
  totalItems: Scalars['Int'];
  totalVol?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  vol7D?: Maybe<Scalars['String']>;
  vol24: Scalars['String'];
  vol24Delta?: Maybe<Scalars['String']>;
  vol30D?: Maybe<Scalars['String']>;
};

export type CollectionsResult = PagingResult & {
  __typename?: 'CollectionsResult';
  items: Array<Collection>;
  totalItems: Scalars['Int'];
};

export type CreateCollectionInput = {
  address: Scalars['String'];
  bpsRoyaltyStrategy?: InputMaybe<Scalars['String']>;
  collectionObject?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discord?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  orderbook?: InputMaybe<Scalars['String']>;
  orderbookType?: InputMaybe<OrderbookType>;
  packageModule?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  somisOrderbook?: InputMaybe<Scalars['String']>;
  transferAllowlist?: InputMaybe<Scalars['String']>;
  transferPolicy?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  website?: InputMaybe<Scalars['String']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
  withdrawPolicy?: InputMaybe<Scalars['String']>;
};

export type CreateLaunchpadInput = {
  borrowPolicy?: InputMaybe<Scalars['String']>;
  category: Scalars['String'];
  collectionAddress?: InputMaybe<Scalars['String']>;
  discord?: InputMaybe<Scalars['String']>;
  flags?: InputMaybe<Array<FlagInput>>;
  hatchDate?: InputMaybe<Scalars['DateTime']>;
  hatchMetadata?: InputMaybe<Array<HatchMetadataInput>>;
  launchDate?: InputMaybe<Scalars['DateTime']>;
  launchpadAddress?: InputMaybe<Scalars['String']>;
  listing?: InputMaybe<Scalars['String']>;
  market?: InputMaybe<Scalars['String']>;
  metadataStore?: InputMaybe<Scalars['String']>;
  mintPrice?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
  publisher?: InputMaybe<Scalars['String']>;
  royalty?: InputMaybe<Scalars['Int']>;
  sections?: InputMaybe<Array<SectionInput>>;
  supply?: InputMaybe<Scalars['Int']>;
  twitter?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<VenueInput>>;
  warehouse?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
  zealyApiKey?: InputMaybe<Scalars['String']>;
  zealySubdomain?: InputMaybe<Scalars['String']>;
  zealyXp?: InputMaybe<Scalars['Int']>;
};

export type CreateNftEventInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  newOwner?: InputMaybe<Scalars['String']>;
  originOwner?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Price']>;
  txId?: InputMaybe<Scalars['String']>;
  type: NftEventType;
};

export type Creator = {
  __typename?: 'Creator';
  share?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
};

export type Flag = {
  __typename?: 'Flag';
  included: Scalars['Boolean'];
  name: Scalars['String'];
};

export type FlagInput = {
  included: Scalars['Boolean'];
  name: Scalars['String'];
};

export type HatchMetadata = {
  __typename?: 'HatchMetadata';
  attributes?: Maybe<Array<HatchMetadataAttribute>>;
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
};

export type HatchMetadataAttribute = {
  __typename?: 'HatchMetadataAttribute';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type HatchMetadataAttributeInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type HatchMetadataInput = {
  attributes: Array<HatchMetadataAttributeInput>;
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
};

export enum IntervalUnit {
  Day = 'DAY',
  Hour = 'HOUR',
  Min = 'MIN'
}

export type Launchpad = {
  __typename?: 'Launchpad';
  borrowPolicy?: Maybe<Scalars['String']>;
  category: Scalars['String'];
  collection?: Maybe<Collection>;
  collectionAddress?: Maybe<Scalars['String']>;
  coverUrl: Scalars['String'];
  /** @deprecated use zealySubdomain */
  crew3Subdomain?: Maybe<Scalars['String']>;
  discord?: Maybe<Scalars['String']>;
  flags?: Maybe<Array<Flag>>;
  hatchDate?: Maybe<Scalars['DateTime']>;
  hatchMetadata?: Maybe<Array<HatchMetadata>>;
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  items?: Maybe<Scalars['Int']>;
  /** @deprecated Use vanues */
  launchDate?: Maybe<Scalars['DateTime']>;
  listing?: Maybe<Scalars['String']>;
  logoUrl: Scalars['String'];
  market?: Maybe<Scalars['String']>;
  metadataStore?: Maybe<Scalars['String']>;
  /** @deprecated Use vanues */
  mintPrice?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  owners?: Maybe<Scalars['Int']>;
  publisher?: Maybe<Scalars['String']>;
  royalty?: Maybe<Scalars['Int']>;
  sections?: Maybe<Array<Section>>;
  supply?: Maybe<Scalars['Int']>;
  totalSales?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  /** @deprecated Use vanues */
  venue?: Maybe<Scalars['String']>;
  venues?: Maybe<Array<Venue>>;
  warehouse?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  whitelisted?: Maybe<Scalars['Boolean']>;
  zealyApiKey?: Maybe<Scalars['String']>;
  zealySubdomain?: Maybe<Scalars['String']>;
  zealyXp?: Maybe<Scalars['Int']>;
};

export type LaunchpadFilterInput = {
  keyword?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
};

export type LaunchpadsResult = PagingResult & {
  __typename?: 'LaunchpadsResult';
  items: Array<Launchpad>;
  totalItems: Scalars['Int'];
};

export type LeaderboardRecord = {
  __typename?: 'LeaderboardRecord';
  point: Scalars['Float'];
  user: User;
  volume: Scalars['Float'];
};

export type LeaderboardResult = {
  __typename?: 'LeaderboardResult';
  items: Array<LeaderboardRecord>;
  totalItems: Scalars['Int'];
};

export type LoginChallenge = {
  __typename?: 'LoginChallenge';
  jwt: Scalars['String'];
  signData: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  adminCreateUser: User;
  adminDeleteUser: User;
  adminUpdateUser: User;
  adminUpdateUserCoverImage: AwsPresignedPost;
  adminUpdateUserProfileImage: AwsPresignedPost;
  completeNotification?: Maybe<Scalars['Boolean']>;
  connectDiscord: Scalars['Boolean'];
  connectTwitter: Scalars['Boolean'];
  createCollection: Collection;
  createLaunchpad: Launchpad;
  createNftEvent: NftEvent;
  deleteCollection: Collection;
  deleteLaunchpad: Launchpad;
  deleteNftEvent: NftEvent;
  disconnectDiscord: Scalars['Boolean'];
  disconnectTwitter: Scalars['Boolean'];
  dismissAllNotification?: Maybe<Scalars['Boolean']>;
  dismissNotification?: Maybe<Scalars['Boolean']>;
  getNftUploadImageUrl: AwsPresignedPost;
  indexCollection?: Maybe<Scalars['Boolean']>;
  indexCollectionByContract?: Maybe<Scalars['Boolean']>;
  indexNft?: Maybe<Scalars['Boolean']>;
  indexWallet: Scalars['Boolean'];
  onMint: Scalars['Boolean'];
  requestLoginChallenge: LoginChallenge;
  submitLoginChallenge: Scalars['String'];
  updateAppConfig: AppConfig;
  updateCollection: Collection;
  updateCollectionCoverUrl: AwsPresignedPost;
  updateCollectionImageUrl: AwsPresignedPost;
  updateCollectionLogoUrl: AwsPresignedPost;
  updateLaunchpad: Launchpad;
  updateLaunchpadCover: AwsPresignedPost;
  updateLaunchpadImage: AwsPresignedPost;
  updateLaunchpadLogo: AwsPresignedPost;
  updateNftEvent: NftEvent;
  updateUser: User;
  updateUserCoverImage: AwsPresignedPost;
  updateUserProfileImage: AwsPresignedPost;
};


export type MutationAdminCreateUserArgs = {
  input: AdminCreateUserInput;
};


export type MutationAdminDeleteUserArgs = {
  address: Scalars['String'];
};


export type MutationAdminUpdateUserArgs = {
  address: Scalars['String'];
  input: AdminUpdateUserInput;
};


export type MutationAdminUpdateUserCoverImageArgs = {
  address: Scalars['String'];
};


export type MutationAdminUpdateUserProfileImageArgs = {
  address: Scalars['String'];
};


export type MutationCompleteNotificationArgs = {
  id: Scalars['String'];
};


export type MutationConnectDiscordArgs = {
  code: Scalars['String'];
  redirectUri: Scalars['String'];
};


export type MutationConnectTwitterArgs = {
  oauthToken: Scalars['String'];
  oauthVerifier: Scalars['String'];
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateLaunchpadArgs = {
  input: CreateLaunchpadInput;
};


export type MutationCreateNftEventArgs = {
  input: CreateNftEventInput;
  nftAddress: Scalars['String'];
};


export type MutationDeleteCollectionArgs = {
  address: Scalars['String'];
};


export type MutationDeleteLaunchpadArgs = {
  id: Scalars['String'];
};


export type MutationDeleteNftEventArgs = {
  id: Scalars['String'];
};


export type MutationDismissNotificationArgs = {
  id: Scalars['String'];
};


export type MutationGetNftUploadImageUrlArgs = {
  address: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationIndexCollectionArgs = {
  address: Scalars['String'];
};


export type MutationIndexCollectionByContractArgs = {
  address: Scalars['String'];
};


export type MutationIndexNftArgs = {
  address: Scalars['String'];
};


export type MutationIndexWalletArgs = {
  address: Scalars['String'];
};


export type MutationOnMintArgs = {
  launchpadId: Scalars['String'];
  nftAddress: Scalars['String'];
  txId: Scalars['String'];
};


export type MutationRequestLoginChallengeArgs = {
  publicKey: Scalars['String'];
};


export type MutationSubmitLoginChallengeArgs = {
  jwt: Scalars['String'];
  signature: Scalars['String'];
};


export type MutationUpdateAppConfigArgs = {
  input: UpdateAppConfigInput;
};


export type MutationUpdateCollectionArgs = {
  address: Scalars['String'];
  input: UpdateCollectionInput;
};


export type MutationUpdateCollectionCoverUrlArgs = {
  address: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCollectionImageUrlArgs = {
  address: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCollectionLogoUrlArgs = {
  address: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateLaunchpadArgs = {
  id: Scalars['String'];
  input: UpdateLaunchpadInput;
};


export type MutationUpdateLaunchpadCoverArgs = {
  id: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateLaunchpadImageArgs = {
  id: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateLaunchpadLogoArgs = {
  id: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateNftEventArgs = {
  id: Scalars['String'];
  input: UpdateNftEventInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Nft = {
  __typename?: 'Nft';
  address: Scalars['ID'];
  attributes?: Maybe<Array<NftAttribute>>;
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars['String']>;
  events: Array<NftEvent>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Order>;
  owner?: Maybe<User>;
  type?: Maybe<Scalars['String']>;
};

export type NftAttribute = {
  __typename?: 'NftAttribute';
  floor?: Maybe<Scalars['String']>;
  items: Scalars['Int'];
  lastSale?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  percentage?: Maybe<Scalars['Float']>;
  value: Scalars['String'];
};

export type NftAttributesFilter = {
  name: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type NftEvent = {
  __typename?: 'NftEvent';
  createdAt?: Maybe<Scalars['DateTime']>;
  /** @deprecated No longer supported */
  id: Scalars['String'];
  newOwner?: Maybe<User>;
  originOwner?: Maybe<User>;
  price?: Maybe<Scalars['String']>;
  txId: Scalars['ID'];
  type: NftEventType;
  user?: Maybe<User>;
};

export type NftEventResult = PagingResult & {
  __typename?: 'NftEventResult';
  items: Array<NftEvent>;
  totalItems: Scalars['Int'];
};

export enum NftEventType {
  AcceptOffer = 'ACCEPT_OFFER',
  Bid = 'BID',
  Burn = 'BURN',
  Buy = 'BUY',
  CancelAuction = 'CANCEL_AUCTION',
  CancelBid = 'CANCEL_BID',
  CancelCollectionBid = 'CANCEL_COLLECTION_BID',
  CancelOffer = 'CANCEL_OFFER',
  CancelOrder = 'CANCEL_ORDER',
  CreateAuction = 'CREATE_AUCTION',
  CreateCollectionBid = 'CREATE_COLLECTION_BID',
  FulfillCollectionBid = 'FULFILL_COLLECTION_BID',
  List = 'LIST',
  Mint = 'MINT',
  Offer = 'OFFER',
  Transfer = 'TRANSFER'
}

export type NftFilterInput = {
  attributes?: InputMaybe<Array<NftAttributesFilter>>;
  excludeOwned?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Scalars['String']>;
  listedOnly?: InputMaybe<Scalars['Boolean']>;
  maxPrice?: InputMaybe<Scalars['Price']>;
  minPrice?: InputMaybe<Scalars['Price']>;
};

export type NftResult = PagingResult & {
  __typename?: 'NftResult';
  items: Array<Nft>;
  totalItems: Scalars['Int'];
};

export enum NftSortingFields {
  Name = 'NAME',
  Price = 'PRICE'
}

export type NftSortingInput = {
  field?: InputMaybe<NftSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export enum NftsByOwnerListedFilter {
  All = 'ALL',
  Listed = 'LISTED',
  Unlisted = 'UNLISTED'
}

export type Notification = {
  __typename?: 'Notification';
  body?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['NotificationMetadata']>;
  readAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
  type: NotificationType;
};

export type NotificationResult = PagingResult & {
  __typename?: 'NotificationResult';
  items: Array<Notification>;
  totalItems: Scalars['Int'];
};

export enum NotificationType {
  BidFulfilled = 'BID_FULFILLED',
  BidLost = 'BID_LOST',
  Crew3XpReceived = 'CREW3_XP_RECEIVED',
  NftSold = 'NFT_SOLD',
  Other = 'OTHER',
  Welcome = 'WELCOME'
}

export type Order = {
  __typename?: 'Order';
  collectionAddress: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  nft: Nft;
  nftAddress: Scalars['String'];
  orderbook: Scalars['String'];
  orderbookType: OrderbookType;
  price: Scalars['Price'];
  seller: User;
  sellerKiosk?: Maybe<Scalars['String']>;
};

export type OrderEvent = {
  __typename?: 'OrderEvent';
  nft: Nft;
  order?: Maybe<Order>;
  type: OrderEventType;
};

export enum OrderEventType {
  New = 'NEW',
  Removed = 'REMOVED'
}

export enum OrderSortingFields {
  CreatedAt = 'CREATED_AT',
  Price = 'PRICE'
}

export type OrderSortingInput = {
  field?: InputMaybe<OrderSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export enum OrderbookType {
  Ob = 'OB',
  ObV1 = 'OB_V1',
  Somis = 'SOMIS'
}

export type OrdersResult = PagingResult & {
  __typename?: 'OrdersResult';
  items: Array<Order>;
  totalItems: Scalars['Int'];
};

export type OwnedCollection = {
  __typename?: 'OwnedCollection';
  collection: Collection;
  ownedItems: Scalars['Int'];
};

export type PagingInput = {
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type PagingResult = {
  totalItems: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  collectionChartData: Array<Candlestick>;
  collectionEvents: NftEventResult;
  collectionScatterChartData: Array<CollectionScatterChartData>;
  collections: CollectionsResult;
  collectionsByOwner: Array<OwnedCollection>;
  getAppConfig: AppConfig;
  launchpad?: Maybe<Launchpad>;
  launchpads: LaunchpadsResult;
  leaderboards: LeaderboardResult;
  me: User;
  nft?: Maybe<Nft>;
  nftEvents: NftEventResult;
  nftEventsByCollection: NftEventResult;
  nfts: NftResult;
  nftsByOwner: NftResult;
  notifications: NotificationResult;
  ordersByCollection: OrdersResult;
  requestTwitterOAuthCode: TwitterOAuthCode;
  user: User;
  users: UsersResult;
};


export type QueryCollectionArgs = {
  addressOrSlug?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionChartDataArgs = {
  input: CollectionChartDataInput;
};


export type QueryCollectionEventsArgs = {
  address: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
};


export type QueryCollectionScatterChartDataArgs = {
  input: CollectionScatterChartDataInput;
};


export type QueryCollectionsArgs = {
  filter?: InputMaybe<CollectionFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<CollectionSortingInput>;
};


export type QueryCollectionsByOwnerArgs = {
  owner: Scalars['String'];
};


export type QueryLaunchpadArgs = {
  id: Scalars['String'];
};


export type QueryLaunchpadsArgs = {
  filter?: InputMaybe<LaunchpadFilterInput>;
  paging?: InputMaybe<PagingInput>;
};


export type QueryLeaderboardsArgs = {
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftArgs = {
  address: Scalars['String'];
};


export type QueryNftEventsArgs = {
  address: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftEventsByCollectionArgs = {
  collectionAddress: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftsArgs = {
  collectionAddress: Scalars['String'];
  filter?: InputMaybe<NftFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<NftSortingInput>;
};


export type QueryNftsByOwnerArgs = {
  collectionAddress?: InputMaybe<Scalars['String']>;
  listedFilter?: InputMaybe<NftsByOwnerListedFilter>;
  owner: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<NftSortingInput>;
};


export type QueryNotificationsArgs = {
  paging?: InputMaybe<PagingInput>;
};


export type QueryOrdersByCollectionArgs = {
  collectionAddress: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<OrderSortingInput>;
};


export type QueryRequestTwitterOAuthCodeArgs = {
  redirectUrl: Scalars['String'];
};


export type QueryUserArgs = {
  address: Scalars['String'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<UserSortingInput>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Section = {
  __typename?: 'Section';
  content: Scalars['String'];
  title: Scalars['String'];
};

export type SectionInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type SortingInput = {
  order?: InputMaybe<SortingOrder>;
};

export enum SortingOrder {
  Asc = 'ASC',
  Des = 'DES'
}

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']>;
  subscribeCollectionOrders: OrderEvent;
  subscribeNftEvent: NftEvent;
  subscribeNotification: Notification;
};


export type SubscriptionSubscribeCollectionOrdersArgs = {
  collectionAddress: Scalars['String'];
};


export type SubscriptionSubscribeNftEventArgs = {
  nftAddress: Scalars['String'];
};

export type TwitterOAuthCode = {
  __typename?: 'TwitterOAuthCode';
  oauthCallbackConfirmed: Scalars['String'];
  oauthToken: Scalars['String'];
  oauthTokenSecret: Scalars['String'];
};

export type UpdateAppConfigInput = {
  allowlist?: InputMaybe<Scalars['String']>;
  allowlistPackage?: InputMaybe<Scalars['String']>;
  authlistPackage?: InputMaybe<Scalars['String']>;
  commissionAddress?: InputMaybe<Scalars['String']>;
  commissionBps?: InputMaybe<Scalars['String']>;
  dappPackage?: InputMaybe<Scalars['String']>;
  dappPackages?: InputMaybe<Array<Scalars['String']>>;
  explorerRpc?: InputMaybe<Scalars['String']>;
  koiskPackage?: InputMaybe<Scalars['String']>;
  launchpadPackage?: InputMaybe<Scalars['String']>;
  launchpadV2Package?: InputMaybe<Scalars['String']>;
  liquidityLayerPackage?: InputMaybe<Scalars['String']>;
  liquidityLayerV1Package?: InputMaybe<Scalars['String']>;
  network?: InputMaybe<Scalars['String']>;
  nftProtocolPackage?: InputMaybe<Scalars['String']>;
  permissionPackage?: InputMaybe<Scalars['String']>;
  privateRpc?: InputMaybe<Scalars['String']>;
  requestPackage?: InputMaybe<Scalars['String']>;
  rpc?: InputMaybe<Scalars['String']>;
  wsRpc?: InputMaybe<Scalars['String']>;
};

export type UpdateCollectionInput = {
  bpsRoyaltyStrategy?: InputMaybe<Scalars['String']>;
  collectionObject?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discord?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  orderbook?: InputMaybe<Scalars['String']>;
  orderbookType?: InputMaybe<OrderbookType>;
  packageModule?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  somisOrderbook?: InputMaybe<Scalars['String']>;
  transferAllowlist?: InputMaybe<Scalars['String']>;
  transferPolicy?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  website?: InputMaybe<Scalars['String']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
  withdrawPolicy?: InputMaybe<Scalars['String']>;
};

export type UpdateLaunchpadInput = {
  borrowPolicy?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  collectionAddress?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discord?: InputMaybe<Scalars['String']>;
  flags?: InputMaybe<Array<FlagInput>>;
  hatchDate?: InputMaybe<Scalars['DateTime']>;
  hatchMetadata?: InputMaybe<Array<HatchMetadataInput>>;
  launchDate?: InputMaybe<Scalars['DateTime']>;
  launchpadAddress?: InputMaybe<Scalars['String']>;
  listing?: InputMaybe<Scalars['String']>;
  market?: InputMaybe<Scalars['String']>;
  metadataStore?: InputMaybe<Scalars['String']>;
  mintPrice?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  publisher?: InputMaybe<Scalars['String']>;
  royalty?: InputMaybe<Scalars['Int']>;
  sections?: InputMaybe<Array<SectionInput>>;
  supply?: InputMaybe<Scalars['Int']>;
  twitter?: InputMaybe<Scalars['String']>;
  venue?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<VenueInput>>;
  warehouse?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  whitelisted?: InputMaybe<Scalars['Boolean']>;
  zealyApiKey?: InputMaybe<Scalars['String']>;
  zealySubdomain?: InputMaybe<Scalars['String']>;
  zealyXp?: InputMaybe<Scalars['Int']>;
};

export type UpdateNftEventInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  newOwner?: InputMaybe<Scalars['String']>;
  originOwner?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Price']>;
  txId?: InputMaybe<Scalars['String']>;
  type: NftEventType;
};

export type UpdateUserInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['ID'];
  coverUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  discordConnected?: Maybe<Scalars['Boolean']>;
  discordHandle?: Maybe<Scalars['String']>;
  estValue: Scalars['Float'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  listed: Scalars['Int'];
  name: Scalars['String'];
  ownedItems: Scalars['Int'];
  profileUrl?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  twitterConnected?: Maybe<Scalars['Boolean']>;
  twitterHandle?: Maybe<Scalars['String']>;
  unlisted: Scalars['Int'];
  username: Scalars['String'];
};

export type UserFilterInput = {
  keyword?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Role>;
};

export enum UserSortingFields {
  Lastlogin = 'LASTLOGIN',
  Name = 'NAME',
  Role = 'ROLE',
  Username = 'USERNAME'
}

export type UserSortingInput = {
  field?: InputMaybe<UserSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type UsersResult = PagingResult & {
  __typename?: 'UsersResult';
  items: Array<User>;
  totalItems: Scalars['Int'];
};

export type Venue = {
  __typename?: 'Venue';
  address: Scalars['String'];
  isPublicSale: Scalars['Boolean'];
  maxMintPerWallet: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['String'];
  startTime: Scalars['DateTime'];
};

export type VenueInput = {
  address: Scalars['String'];
  isPublicSale: Scalars['Boolean'];
  maxMintPerWallet: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['String'];
  startTime: Scalars['DateTime'];
};

export type ListCollectionsQueryVariables = Exact<{
  field?: InputMaybe<CollectionSortingFields>;
  order?: InputMaybe<SortingOrder>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Scalars['String']>;
}>;


export type ListCollectionsQuery = { __typename?: 'Query', collections: { __typename?: 'CollectionsResult', totalItems: number, items: Array<{ __typename?: 'Collection', name: string, address: string, coverUrl?: string | null, imageUrl?: string | null, verified?: boolean | null, stats?: { __typename?: 'CollectionStats', floor?: string | null, totalVol?: string | null, vol24: string, vol24Delta?: string | null, owners: number, listedItem: number } | null }> } };

export type QueryCollectionQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type QueryCollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', name: string, description?: string | null, coverUrl?: string | null, imageUrl?: string | null, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, bpsRoyaltyStrategy?: string | null, type?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, verified?: boolean | null, orderbookType?: OrderbookType | null, attributes: Array<{ __typename?: 'CollectionAttribute', name?: string | null, values: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, value: string, percentage?: number | null }> }>, stats?: { __typename?: 'CollectionStats', floor?: string | null, vol24: string, vol24Delta?: string | null, totalVol?: string | null, owners: number, listedItem: number, totalItems: number } | null, collectionBidStats: { __typename?: 'CollectionBidStats', items: Array<{ __typename?: 'CollectionBidStatsItem', price: string, numberOfBid: number, owner: number }> } } | null };

export type GetOrdersByCollectionQueryVariables = Exact<{
  collectionAddress: Scalars['String'];
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<OrderSortingInput>;
}>;


export type GetOrdersByCollectionQuery = { __typename?: 'Query', ordersByCollection: { __typename?: 'OrdersResult', totalItems: number, items: Array<{ __typename?: 'Order', id: string, nftAddress: string, collectionAddress: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, seller: { __typename?: 'User', address: string }, nft: { __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null } | null, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null } }> } };

export type SubscribeCollectionOrdersSubscriptionVariables = Exact<{
  collectionAddress: Scalars['String'];
}>;


export type SubscribeCollectionOrdersSubscription = { __typename?: 'Subscription', subscribeCollectionOrders: { __typename?: 'OrderEvent', type: OrderEventType, order?: { __typename?: 'Order', id: string, nftAddress: string, collectionAddress: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, seller: { __typename?: 'User', address: string }, nft: { __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null } | null, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null } } | null, nft: { __typename?: 'Nft', address: string } } };

export type CollectionChartDataQueryVariables = Exact<{
  address: Scalars['String'];
  interval?: Scalars['Int'];
  intervalUnit?: IntervalUnit;
  from: Scalars['DateTime'];
  to: Scalars['DateTime'];
}>;


export type CollectionChartDataQuery = { __typename?: 'Query', collectionChartData: Array<{ __typename?: 'Candlestick', o: number, c: number, h: number, l: number, v: number, ts: number }> };

export type GetCollectionsByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type GetCollectionsByOwnerQuery = { __typename?: 'Query', collectionsByOwner: Array<{ __typename?: 'OwnedCollection', ownedItems: number, collection: { __typename?: 'Collection', address: string, name: string, slug: string, imageUrl?: string | null, stats?: { __typename?: 'CollectionStats', floor?: string | null } | null } }> };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'Collection', address: string, name: string, slug: string, description?: string | null, royalty?: number | null, verified?: boolean | null, imageUrl?: string | null, coverUrl?: string | null, orderbook?: string | null, type?: string | null, creators?: Array<{ __typename?: 'Creator', share?: number | null, user?: { __typename?: 'User', address: string, name: string } | null } | null> | null } };

export type UpdateCollectionImageUrlMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type UpdateCollectionImageUrlMutation = { __typename?: 'Mutation', updateCollectionImageUrl: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type UpdateCollectionCoverUrlMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type UpdateCollectionCoverUrlMutation = { __typename?: 'Mutation', updateCollectionCoverUrl: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type UpdateCollectionLogoUrlMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type UpdateCollectionLogoUrlMutation = { __typename?: 'Mutation', updateCollectionLogoUrl: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type UpdateNftUploadImageUrlMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type UpdateNftUploadImageUrlMutation = { __typename?: 'Mutation', getNftUploadImageUrl: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type RequestLoginChallengeMutationVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type RequestLoginChallengeMutation = { __typename?: 'Mutation', requestLoginChallenge: { __typename?: 'LoginChallenge', jwt: string, signData: string } };

export type SubmitLoginChallengeMutationVariables = Exact<{
  jwt: Scalars['String'];
  signature: Scalars['String'];
}>;


export type SubmitLoginChallengeMutation = { __typename?: 'Mutation', submitLoginChallenge: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', address: string, name: string, username: string, profileUrl?: string | null, coverUrl?: string | null, role?: Role | null, description?: string | null, lastLogin?: any | null, ownedItems: number, listed: number, unlisted: number, estValue: number, discordConnected?: boolean | null, discordHandle?: string | null, twitterConnected?: boolean | null, twitterHandle?: string | null } };

export type GetAppConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAppConfigQuery = { __typename?: 'Query', getAppConfig: { __typename?: 'AppConfig', rpc?: string | null, permissionPackage?: string | null, allowlistPackage?: string | null, authlistPackage?: string | null, requestPackage?: string | null, koiskPackage?: string | null, liquidityLayerPackage?: string | null, liquidityLayerV1Package?: string | null, launchpadPackage?: string | null, nftProtocolPackage?: string | null, launchpadV2Package?: string | null, dappPackage?: string | null, allowlist?: string | null, network?: string | null, updatedAt: any, commissionBps?: string | null, commissionAddress?: string | null } };

export type LaunchpadPartsFragment = { __typename?: 'Launchpad', id: string, name: string, category: string, imageUrl: string, logoUrl: string, coverUrl: string, launchDate?: any | null, collectionAddress?: string | null, mintPrice?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, supply?: number | null, publisher?: string | null, metadataStore?: string | null, borrowPolicy?: string | null, hatchDate?: any | null, royalty?: number | null, zealySubdomain?: string | null, listing?: string | null, venue?: string | null, warehouse?: string | null, market?: string | null, owners?: number | null, totalSales?: string | null, order?: number | null, hatchMetadata?: Array<{ __typename?: 'HatchMetadata', name: string, description: string, imageUrl: string, attributes?: Array<{ __typename?: 'HatchMetadataAttribute', name: string, value: string }> | null }> | null, sections?: Array<{ __typename?: 'Section', title: string, content: string }> | null, flags?: Array<{ __typename?: 'Flag', name: string, included: boolean }> | null, collection?: { __typename?: 'Collection', type?: string | null, orderbook?: string | null, address: string, description?: string | null } | null, venues?: Array<{ __typename?: 'Venue', name: string, address: string, maxMintPerWallet: number, startTime: any, price: string, isPublicSale: boolean }> | null };

export type QueryLaunchpadQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type QueryLaunchpadQuery = { __typename?: 'Query', launchpad?: { __typename?: 'Launchpad', id: string, name: string, category: string, imageUrl: string, logoUrl: string, coverUrl: string, launchDate?: any | null, collectionAddress?: string | null, mintPrice?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, supply?: number | null, publisher?: string | null, metadataStore?: string | null, borrowPolicy?: string | null, hatchDate?: any | null, royalty?: number | null, zealySubdomain?: string | null, listing?: string | null, venue?: string | null, warehouse?: string | null, market?: string | null, owners?: number | null, totalSales?: string | null, order?: number | null, hatchMetadata?: Array<{ __typename?: 'HatchMetadata', name: string, description: string, imageUrl: string, attributes?: Array<{ __typename?: 'HatchMetadataAttribute', name: string, value: string }> | null }> | null, sections?: Array<{ __typename?: 'Section', title: string, content: string }> | null, flags?: Array<{ __typename?: 'Flag', name: string, included: boolean }> | null, collection?: { __typename?: 'Collection', type?: string | null, orderbook?: string | null, address: string, description?: string | null } | null, venues?: Array<{ __typename?: 'Venue', name: string, address: string, maxMintPerWallet: number, startTime: any, price: string, isPublicSale: boolean }> | null } | null };

export type ListLaunchpadsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  keyword?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
}>;


export type ListLaunchpadsQuery = { __typename?: 'Query', launchpads: { __typename?: 'LaunchpadsResult', totalItems: number, items: Array<{ __typename?: 'Launchpad', id: string, name: string, category: string, imageUrl: string, logoUrl: string, coverUrl: string, launchDate?: any | null, collectionAddress?: string | null, mintPrice?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, supply?: number | null, publisher?: string | null, metadataStore?: string | null, borrowPolicy?: string | null, hatchDate?: any | null, royalty?: number | null, zealySubdomain?: string | null, listing?: string | null, venue?: string | null, warehouse?: string | null, market?: string | null, owners?: number | null, totalSales?: string | null, order?: number | null, hatchMetadata?: Array<{ __typename?: 'HatchMetadata', name: string, description: string, imageUrl: string, attributes?: Array<{ __typename?: 'HatchMetadataAttribute', name: string, value: string }> | null }> | null, sections?: Array<{ __typename?: 'Section', title: string, content: string }> | null, flags?: Array<{ __typename?: 'Flag', name: string, included: boolean }> | null, collection?: { __typename?: 'Collection', type?: string | null, orderbook?: string | null, address: string, description?: string | null } | null, venues?: Array<{ __typename?: 'Venue', name: string, address: string, maxMintPerWallet: number, startTime: any, price: string, isPublicSale: boolean }> | null }> } };

export type OnMintMutationVariables = Exact<{
  launchpadId: Scalars['String'];
  nftAddress: Scalars['String'];
  txId: Scalars['String'];
}>;


export type OnMintMutation = { __typename?: 'Mutation', onMint: boolean };

export type CreateLaunchpadMutationVariables = Exact<{
  input: CreateLaunchpadInput;
}>;


export type CreateLaunchpadMutation = { __typename?: 'Mutation', createLaunchpad: { __typename?: 'Launchpad', id: string, name: string, category: string, imageUrl: string, logoUrl: string, coverUrl: string, launchDate?: any | null, collectionAddress?: string | null, mintPrice?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, supply?: number | null, publisher?: string | null, metadataStore?: string | null, borrowPolicy?: string | null, hatchDate?: any | null, royalty?: number | null, zealySubdomain?: string | null, listing?: string | null, venue?: string | null, warehouse?: string | null, market?: string | null, owners?: number | null, totalSales?: string | null, order?: number | null, hatchMetadata?: Array<{ __typename?: 'HatchMetadata', name: string, description: string, imageUrl: string, attributes?: Array<{ __typename?: 'HatchMetadataAttribute', name: string, value: string }> | null }> | null, sections?: Array<{ __typename?: 'Section', title: string, content: string }> | null, flags?: Array<{ __typename?: 'Flag', name: string, included: boolean }> | null, collection?: { __typename?: 'Collection', type?: string | null, orderbook?: string | null, address: string, description?: string | null } | null, venues?: Array<{ __typename?: 'Venue', name: string, address: string, maxMintPerWallet: number, startTime: any, price: string, isPublicSale: boolean }> | null } };

export type UpdateLaunchpadMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateLaunchpadInput;
}>;


export type UpdateLaunchpadMutation = { __typename?: 'Mutation', updateLaunchpad: { __typename?: 'Launchpad', id: string, name: string, category: string, imageUrl: string, logoUrl: string, coverUrl: string, launchDate?: any | null, collectionAddress?: string | null, mintPrice?: string | null, twitter?: string | null, discord?: string | null, website?: string | null, supply?: number | null, publisher?: string | null, metadataStore?: string | null, borrowPolicy?: string | null, hatchDate?: any | null, royalty?: number | null, zealySubdomain?: string | null, listing?: string | null, venue?: string | null, warehouse?: string | null, market?: string | null, owners?: number | null, totalSales?: string | null, order?: number | null, hatchMetadata?: Array<{ __typename?: 'HatchMetadata', name: string, description: string, imageUrl: string, attributes?: Array<{ __typename?: 'HatchMetadataAttribute', name: string, value: string }> | null }> | null, sections?: Array<{ __typename?: 'Section', title: string, content: string }> | null, flags?: Array<{ __typename?: 'Flag', name: string, included: boolean }> | null, collection?: { __typename?: 'Collection', type?: string | null, orderbook?: string | null, address: string, description?: string | null } | null, venues?: Array<{ __typename?: 'Venue', name: string, address: string, maxMintPerWallet: number, startTime: any, price: string, isPublicSale: boolean }> | null } };

export type UpdateLaunchpadImageMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateLaunchpadImageMutation = { __typename?: 'Mutation', updateLaunchpadImage: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type UpdateLaunchpadCoverMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateLaunchpadCoverMutation = { __typename?: 'Mutation', updateLaunchpadCover: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type UpdateLaunchpadLogoMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateLaunchpadLogoMutation = { __typename?: 'Mutation', updateLaunchpadLogo: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type ListLeaderboardsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ListLeaderboardsQuery = { __typename?: 'Query', leaderboards: { __typename?: 'LeaderboardResult', totalItems: number, items: Array<{ __typename?: 'LeaderboardRecord', volume: number, point: number, user: { __typename?: 'User', address: string, name: string, username: string, profileUrl?: string | null } }> } };

export type NftPartsFragment = { __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null } | null, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null };

export type ListNftsQueryVariables = Exact<{
  address: Scalars['String'];
  filter?: InputMaybe<NftFilterInput>;
  field?: InputMaybe<NftSortingFields>;
  order?: InputMaybe<SortingOrder>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ListNftsQuery = { __typename?: 'Query', nfts: { __typename?: 'NftResult', totalItems: number, items: Array<{ __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null } | null, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null }> } };

export type QueryNftQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type QueryNftQuery = { __typename?: 'Query', nft?: { __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, imageUrl?: string | null, royalty?: number | null, description?: string | null, orderbook?: string | null, type?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null, stats?: { __typename?: 'CollectionStats', floor?: string | null } | null, creators?: Array<{ __typename?: 'Creator', share?: number | null, user?: { __typename?: 'User', address: string } | null } | null> | null } | null, events: Array<{ __typename?: 'NftEvent', id: string, type: NftEventType, txId: string, price?: string | null, createdAt?: any | null, originOwner?: { __typename?: 'User', address: string } | null, newOwner?: { __typename?: 'User', address: string } | null }>, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null } | null };

export type GetNftsByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
  field?: InputMaybe<NftSortingFields>;
  collectionAddress?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<SortingOrder>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  listedFilter?: InputMaybe<NftsByOwnerListedFilter>;
}>;


export type GetNftsByOwnerQuery = { __typename?: 'Query', nftsByOwner: { __typename?: 'NftResult', totalItems: number, items: Array<{ __typename?: 'Nft', address: string, name?: string | null, description?: string | null, imageUrl?: string | null, type?: string | null, collection?: { __typename?: 'Collection', name: string, address: string, orderbook?: string | null, somisOrderbook?: string | null, transferPolicy?: string | null, withdrawPolicy?: string | null, bpsRoyaltyStrategy?: string | null, transferAllowlist?: string | null, collectionObject?: string | null, orderbookType?: OrderbookType | null } | null, attributes?: Array<{ __typename?: 'NftAttribute', floor?: string | null, items: number, name: string, percentage?: number | null, value: string }> | null, owner?: { __typename?: 'User', address: string } | null, order?: { __typename?: 'Order', id: string, price: any, sellerKiosk?: string | null, createdAt?: any | null, orderbookType: OrderbookType, seller: { __typename?: 'User', address: string } } | null }> } };

export type IndexNftMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type IndexNftMutation = { __typename?: 'Mutation', indexNft?: boolean | null };

export type SubscribeNftEventSubscriptionVariables = Exact<{
  address: Scalars['String'];
}>;


export type SubscribeNftEventSubscription = { __typename?: 'Subscription', subscribeNftEvent: { __typename?: 'NftEvent', type: NftEventType, txId: string, price?: string | null, createdAt?: any | null, originOwner?: { __typename?: 'User', address: string } | null, newOwner?: { __typename?: 'User', address: string } | null } };

export type UserPartsFragment = { __typename?: 'User', address: string, name: string, username: string, profileUrl?: string | null, coverUrl?: string | null, role?: Role | null, description?: string | null, lastLogin?: any | null, ownedItems: number, listed: number, unlisted: number, estValue: number, discordConnected?: boolean | null, discordHandle?: string | null, twitterConnected?: boolean | null, twitterHandle?: string | null };

export type GetUserQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', address: string, name: string, username: string, profileUrl?: string | null, coverUrl?: string | null, role?: Role | null, description?: string | null, lastLogin?: any | null, ownedItems: number, listed: number, unlisted: number, estValue: number, discordConnected?: boolean | null, discordHandle?: string | null, twitterConnected?: boolean | null, twitterHandle?: string | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', address: string, profileUrl?: string | null, name: string, username: string } };

export type UpdateUserProfileImageMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateUserProfileImageMutation = { __typename?: 'Mutation', updateUserProfileImage: { __typename?: 'AWSPresignedPost', url: string, fields: any } };

export type ConnectDiscordMutationVariables = Exact<{
  code: Scalars['String'];
  redirectUri: Scalars['String'];
}>;


export type ConnectDiscordMutation = { __typename?: 'Mutation', connectDiscord: boolean };

export type RequestTwitterOAuthCodeQueryVariables = Exact<{
  redirectUrl: Scalars['String'];
}>;


export type RequestTwitterOAuthCodeQuery = { __typename?: 'Query', requestTwitterOAuthCode: { __typename?: 'TwitterOAuthCode', oauthToken: string, oauthTokenSecret: string, oauthCallbackConfirmed: string } };

export type ConnectTwitterMutationVariables = Exact<{
  oauthToken: Scalars['String'];
  oauthVerifier: Scalars['String'];
}>;


export type ConnectTwitterMutation = { __typename?: 'Mutation', connectTwitter: boolean };

export type DisconnectTwitterMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectTwitterMutation = { __typename?: 'Mutation', disconnectTwitter: boolean };

export type DisconnectDiscordMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectDiscordMutation = { __typename?: 'Mutation', disconnectDiscord: boolean };

export type GetNotificationsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'NotificationResult', totalItems: number, items: Array<{ __typename?: 'Notification', id: string, type: NotificationType, createdAt: any, title?: string | null, body?: string | null, metadata?: any | null, readAt?: any | null, completedAt?: any | null }> } };

export type DismissNotificationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DismissNotificationMutation = { __typename?: 'Mutation', dismissNotification?: boolean | null };

export type DismissAllNotificationMutationVariables = Exact<{ [key: string]: never; }>;


export type DismissAllNotificationMutation = { __typename?: 'Mutation', dismissAllNotification?: boolean | null };

export type CompleteNotificationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CompleteNotificationMutation = { __typename?: 'Mutation', completeNotification?: boolean | null };

export type SubscribeToNotificationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToNotificationsSubscription = { __typename?: 'Subscription', subscribeNotification: { __typename?: 'Notification', id: string, type: NotificationType, createdAt: any, title?: string | null, body?: string | null, metadata?: any | null, readAt?: any | null, completedAt?: any | null } };

export const LaunchpadPartsFragmentDoc = /*#__PURE__*/ `
    fragment LaunchpadParts on Launchpad {
  id
  name
  category
  imageUrl
  logoUrl
  coverUrl
  launchDate
  collectionAddress
  mintPrice
  twitter
  discord
  website
  supply
  publisher
  metadataStore
  borrowPolicy
  hatchDate
  hatchMetadata {
    name
    description
    imageUrl
    attributes {
      name
      value
    }
  }
  royalty
  zealySubdomain
  sections {
    title
    content
  }
  flags {
    name
    included
  }
  collection {
    type
    orderbook
    address
    description
  }
  listing
  venue
  venues {
    name
    address
    maxMintPerWallet
    startTime
    price
    isPublicSale
  }
  warehouse
  market
  owners
  totalSales
  order
}
    `;
export const NftPartsFragmentDoc = /*#__PURE__*/ `
    fragment NftParts on Nft {
  address
  name
  description
  imageUrl
  type
  collection {
    name
    address
    orderbook
    somisOrderbook
    transferPolicy
    withdrawPolicy
    bpsRoyaltyStrategy
    transferAllowlist
    collectionObject
    orderbookType
  }
  attributes {
    floor
    items
    name
    percentage
    value
  }
  owner {
    address
  }
  order {
    id
    price
    seller {
      address
    }
    sellerKiosk
    createdAt
    orderbookType
  }
}
    `;
export const UserPartsFragmentDoc = /*#__PURE__*/ `
    fragment UserParts on User {
  address
  name
  username
  profileUrl
  coverUrl
  role
  description
  lastLogin
  ownedItems
  listed
  unlisted
  estValue
  discordConnected
  discordHandle
  twitterConnected
  twitterHandle
}
    `;
export const ListCollectionsDocument = /*#__PURE__*/ `
    query ListCollections($field: CollectionSortingFields, $order: SortingOrder, $limit: Int, $skip: Int, $verified: Boolean, $keyword: String) {
  collections(
    sorting: {field: $field, order: $order}
    paging: {limit: $limit, skip: $skip}
    filter: {verified: $verified, keyword: $keyword}
  ) {
    items {
      name
      address
      coverUrl
      imageUrl
      stats {
        floor
        totalVol
        vol24
        vol24Delta
        owners
        listedItem
      }
      verified
    }
    totalItems
  }
}
    `;
export const useListCollectionsQuery = <
      TData = ListCollectionsQuery,
      TError = unknown
    >(
      variables?: ListCollectionsQueryVariables,
      options?: UseQueryOptions<ListCollectionsQuery, TError, TData>
    ) =>
    useQuery<ListCollectionsQuery, TError, TData>(
      variables === undefined ? ['ListCollections'] : ['ListCollections', variables],
      fetcher<ListCollectionsQuery, ListCollectionsQueryVariables>(ListCollectionsDocument, variables),
      options
    );

useListCollectionsQuery.getKey = (variables?: ListCollectionsQueryVariables) => variables === undefined ? ['ListCollections'] : ['ListCollections', variables];
;

export const useInfiniteListCollectionsQuery = <
      TData = ListCollectionsQuery,
      TError = unknown
    >(
      pageParamKey: keyof ListCollectionsQueryVariables,
      variables?: ListCollectionsQueryVariables,
      options?: UseInfiniteQueryOptions<ListCollectionsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<ListCollectionsQuery, TError, TData>(
      variables === undefined ? ['ListCollections.infinite'] : ['ListCollections.infinite', variables],
      (metaData) => fetcher<ListCollectionsQuery, ListCollectionsQueryVariables>(ListCollectionsDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteListCollectionsQuery.getKey = (variables?: ListCollectionsQueryVariables) => variables === undefined ? ['ListCollections.infinite'] : ['ListCollections.infinite', variables];
;

useListCollectionsQuery.fetcher = (variables?: ListCollectionsQueryVariables, options?: RequestInit['headers']) => fetcher<ListCollectionsQuery, ListCollectionsQueryVariables>(ListCollectionsDocument, variables, options);
export const QueryCollectionDocument = /*#__PURE__*/ `
    query QueryCollection($address: String!) {
  collection(addressOrSlug: $address) {
    name
    description
    coverUrl
    imageUrl
    address
    orderbook
    somisOrderbook
    transferPolicy
    withdrawPolicy
    transferAllowlist
    collectionObject
    bpsRoyaltyStrategy
    type
    twitter
    discord
    website
    attributes {
      name
      values {
        floor
        items
        value
        percentage
      }
    }
    verified
    stats {
      floor
      vol24
      vol24Delta
      totalVol
      owners
      listedItem
      totalItems
    }
    collectionBidStats {
      items {
        price
        numberOfBid
        owner
      }
    }
    orderbookType
  }
}
    `;
export const useQueryCollectionQuery = <
      TData = QueryCollectionQuery,
      TError = unknown
    >(
      variables: QueryCollectionQueryVariables,
      options?: UseQueryOptions<QueryCollectionQuery, TError, TData>
    ) =>
    useQuery<QueryCollectionQuery, TError, TData>(
      ['QueryCollection', variables],
      fetcher<QueryCollectionQuery, QueryCollectionQueryVariables>(QueryCollectionDocument, variables),
      options
    );

useQueryCollectionQuery.getKey = (variables: QueryCollectionQueryVariables) => ['QueryCollection', variables];
;

export const useInfiniteQueryCollectionQuery = <
      TData = QueryCollectionQuery,
      TError = unknown
    >(
      pageParamKey: keyof QueryCollectionQueryVariables,
      variables: QueryCollectionQueryVariables,
      options?: UseInfiniteQueryOptions<QueryCollectionQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<QueryCollectionQuery, TError, TData>(
      ['QueryCollection.infinite', variables],
      (metaData) => fetcher<QueryCollectionQuery, QueryCollectionQueryVariables>(QueryCollectionDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteQueryCollectionQuery.getKey = (variables: QueryCollectionQueryVariables) => ['QueryCollection.infinite', variables];
;

useQueryCollectionQuery.fetcher = (variables: QueryCollectionQueryVariables, options?: RequestInit['headers']) => fetcher<QueryCollectionQuery, QueryCollectionQueryVariables>(QueryCollectionDocument, variables, options);
export const GetOrdersByCollectionDocument = /*#__PURE__*/ `
    query GetOrdersByCollection($collectionAddress: String!, $paging: PagingInput, $sorting: OrderSortingInput) {
  ordersByCollection(
    collectionAddress: $collectionAddress
    paging: $paging
    sorting: $sorting
  ) {
    items {
      id
      seller {
        address
      }
      nftAddress
      nft {
        ...NftParts
      }
      collectionAddress
      price
      sellerKiosk
      createdAt
    }
    totalItems
  }
}
    ${NftPartsFragmentDoc}`;
export const useGetOrdersByCollectionQuery = <
      TData = GetOrdersByCollectionQuery,
      TError = unknown
    >(
      variables: GetOrdersByCollectionQueryVariables,
      options?: UseQueryOptions<GetOrdersByCollectionQuery, TError, TData>
    ) =>
    useQuery<GetOrdersByCollectionQuery, TError, TData>(
      ['GetOrdersByCollection', variables],
      fetcher<GetOrdersByCollectionQuery, GetOrdersByCollectionQueryVariables>(GetOrdersByCollectionDocument, variables),
      options
    );

useGetOrdersByCollectionQuery.getKey = (variables: GetOrdersByCollectionQueryVariables) => ['GetOrdersByCollection', variables];
;

export const useInfiniteGetOrdersByCollectionQuery = <
      TData = GetOrdersByCollectionQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetOrdersByCollectionQueryVariables,
      variables: GetOrdersByCollectionQueryVariables,
      options?: UseInfiniteQueryOptions<GetOrdersByCollectionQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetOrdersByCollectionQuery, TError, TData>(
      ['GetOrdersByCollection.infinite', variables],
      (metaData) => fetcher<GetOrdersByCollectionQuery, GetOrdersByCollectionQueryVariables>(GetOrdersByCollectionDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteGetOrdersByCollectionQuery.getKey = (variables: GetOrdersByCollectionQueryVariables) => ['GetOrdersByCollection.infinite', variables];
;

useGetOrdersByCollectionQuery.fetcher = (variables: GetOrdersByCollectionQueryVariables, options?: RequestInit['headers']) => fetcher<GetOrdersByCollectionQuery, GetOrdersByCollectionQueryVariables>(GetOrdersByCollectionDocument, variables, options);
export const SubscribeCollectionOrdersDocument = /*#__PURE__*/ `
    subscription SubscribeCollectionOrders($collectionAddress: String!) {
  subscribeCollectionOrders(collectionAddress: $collectionAddress) {
    type
    order {
      id
      seller {
        address
      }
      nftAddress
      nft {
        ...NftParts
      }
      collectionAddress
      price
      sellerKiosk
      createdAt
    }
    nft {
      address
    }
  }
}
    ${NftPartsFragmentDoc}`;
export const CollectionChartDataDocument = /*#__PURE__*/ `
    query collectionChartData($address: String!, $interval: Int! = 1, $intervalUnit: IntervalUnit! = HOUR, $from: DateTime!, $to: DateTime!) {
  collectionChartData(
    input: {address: $address, interval: $interval, intervalUnit: $intervalUnit, from: $from, to: $to}
  ) {
    o
    c
    h
    l
    v
    ts
  }
}
    `;
export const useCollectionChartDataQuery = <
      TData = CollectionChartDataQuery,
      TError = unknown
    >(
      variables: CollectionChartDataQueryVariables,
      options?: UseQueryOptions<CollectionChartDataQuery, TError, TData>
    ) =>
    useQuery<CollectionChartDataQuery, TError, TData>(
      ['collectionChartData', variables],
      fetcher<CollectionChartDataQuery, CollectionChartDataQueryVariables>(CollectionChartDataDocument, variables),
      options
    );

useCollectionChartDataQuery.getKey = (variables: CollectionChartDataQueryVariables) => ['collectionChartData', variables];
;

export const useInfiniteCollectionChartDataQuery = <
      TData = CollectionChartDataQuery,
      TError = unknown
    >(
      pageParamKey: keyof CollectionChartDataQueryVariables,
      variables: CollectionChartDataQueryVariables,
      options?: UseInfiniteQueryOptions<CollectionChartDataQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<CollectionChartDataQuery, TError, TData>(
      ['collectionChartData.infinite', variables],
      (metaData) => fetcher<CollectionChartDataQuery, CollectionChartDataQueryVariables>(CollectionChartDataDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteCollectionChartDataQuery.getKey = (variables: CollectionChartDataQueryVariables) => ['collectionChartData.infinite', variables];
;

useCollectionChartDataQuery.fetcher = (variables: CollectionChartDataQueryVariables, options?: RequestInit['headers']) => fetcher<CollectionChartDataQuery, CollectionChartDataQueryVariables>(CollectionChartDataDocument, variables, options);
export const GetCollectionsByOwnerDocument = /*#__PURE__*/ `
    query GetCollectionsByOwner($owner: String!) {
  collectionsByOwner(owner: $owner) {
    collection {
      address
      name
      slug
      imageUrl
      stats {
        floor
      }
    }
    ownedItems
  }
}
    `;
export const useGetCollectionsByOwnerQuery = <
      TData = GetCollectionsByOwnerQuery,
      TError = unknown
    >(
      variables: GetCollectionsByOwnerQueryVariables,
      options?: UseQueryOptions<GetCollectionsByOwnerQuery, TError, TData>
    ) =>
    useQuery<GetCollectionsByOwnerQuery, TError, TData>(
      ['GetCollectionsByOwner', variables],
      fetcher<GetCollectionsByOwnerQuery, GetCollectionsByOwnerQueryVariables>(GetCollectionsByOwnerDocument, variables),
      options
    );

useGetCollectionsByOwnerQuery.getKey = (variables: GetCollectionsByOwnerQueryVariables) => ['GetCollectionsByOwner', variables];
;

export const useInfiniteGetCollectionsByOwnerQuery = <
      TData = GetCollectionsByOwnerQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetCollectionsByOwnerQueryVariables,
      variables: GetCollectionsByOwnerQueryVariables,
      options?: UseInfiniteQueryOptions<GetCollectionsByOwnerQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetCollectionsByOwnerQuery, TError, TData>(
      ['GetCollectionsByOwner.infinite', variables],
      (metaData) => fetcher<GetCollectionsByOwnerQuery, GetCollectionsByOwnerQueryVariables>(GetCollectionsByOwnerDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteGetCollectionsByOwnerQuery.getKey = (variables: GetCollectionsByOwnerQueryVariables) => ['GetCollectionsByOwner.infinite', variables];
;

useGetCollectionsByOwnerQuery.fetcher = (variables: GetCollectionsByOwnerQueryVariables, options?: RequestInit['headers']) => fetcher<GetCollectionsByOwnerQuery, GetCollectionsByOwnerQueryVariables>(GetCollectionsByOwnerDocument, variables, options);
export const CreateCollectionDocument = /*#__PURE__*/ `
    mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    address
    name
    slug
    description
    creators {
      user {
        address
        name
      }
      share
    }
    royalty
    verified
    imageUrl
    coverUrl
    orderbook
    type
  }
}
    `;
export const useCreateCollectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCollectionMutation, TError, CreateCollectionMutationVariables, TContext>) =>
    useMutation<CreateCollectionMutation, TError, CreateCollectionMutationVariables, TContext>(
      ['CreateCollection'],
      (variables?: CreateCollectionMutationVariables) => fetcher<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, variables)(),
      options
    );
useCreateCollectionMutation.fetcher = (variables: CreateCollectionMutationVariables, options?: RequestInit['headers']) => fetcher<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, variables, options);
export const UpdateCollectionImageUrlDocument = /*#__PURE__*/ `
    mutation updateCollectionImageUrl($address: String!) {
  updateCollectionImageUrl(address: $address) {
    url
    fields
  }
}
    `;
export const useUpdateCollectionImageUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCollectionImageUrlMutation, TError, UpdateCollectionImageUrlMutationVariables, TContext>) =>
    useMutation<UpdateCollectionImageUrlMutation, TError, UpdateCollectionImageUrlMutationVariables, TContext>(
      ['updateCollectionImageUrl'],
      (variables?: UpdateCollectionImageUrlMutationVariables) => fetcher<UpdateCollectionImageUrlMutation, UpdateCollectionImageUrlMutationVariables>(UpdateCollectionImageUrlDocument, variables)(),
      options
    );
useUpdateCollectionImageUrlMutation.fetcher = (variables: UpdateCollectionImageUrlMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateCollectionImageUrlMutation, UpdateCollectionImageUrlMutationVariables>(UpdateCollectionImageUrlDocument, variables, options);
export const UpdateCollectionCoverUrlDocument = /*#__PURE__*/ `
    mutation updateCollectionCoverUrl($address: String!) {
  updateCollectionCoverUrl(address: $address) {
    url
    fields
  }
}
    `;
export const useUpdateCollectionCoverUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCollectionCoverUrlMutation, TError, UpdateCollectionCoverUrlMutationVariables, TContext>) =>
    useMutation<UpdateCollectionCoverUrlMutation, TError, UpdateCollectionCoverUrlMutationVariables, TContext>(
      ['updateCollectionCoverUrl'],
      (variables?: UpdateCollectionCoverUrlMutationVariables) => fetcher<UpdateCollectionCoverUrlMutation, UpdateCollectionCoverUrlMutationVariables>(UpdateCollectionCoverUrlDocument, variables)(),
      options
    );
useUpdateCollectionCoverUrlMutation.fetcher = (variables: UpdateCollectionCoverUrlMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateCollectionCoverUrlMutation, UpdateCollectionCoverUrlMutationVariables>(UpdateCollectionCoverUrlDocument, variables, options);
export const UpdateCollectionLogoUrlDocument = /*#__PURE__*/ `
    mutation updateCollectionLogoUrl($address: String!) {
  updateCollectionLogoUrl(address: $address) {
    url
    fields
  }
}
    `;
export const useUpdateCollectionLogoUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCollectionLogoUrlMutation, TError, UpdateCollectionLogoUrlMutationVariables, TContext>) =>
    useMutation<UpdateCollectionLogoUrlMutation, TError, UpdateCollectionLogoUrlMutationVariables, TContext>(
      ['updateCollectionLogoUrl'],
      (variables?: UpdateCollectionLogoUrlMutationVariables) => fetcher<UpdateCollectionLogoUrlMutation, UpdateCollectionLogoUrlMutationVariables>(UpdateCollectionLogoUrlDocument, variables)(),
      options
    );
useUpdateCollectionLogoUrlMutation.fetcher = (variables: UpdateCollectionLogoUrlMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateCollectionLogoUrlMutation, UpdateCollectionLogoUrlMutationVariables>(UpdateCollectionLogoUrlDocument, variables, options);
export const UpdateNftUploadImageUrlDocument = /*#__PURE__*/ `
    mutation updateNftUploadImageUrl($address: String!) {
  getNftUploadImageUrl(address: $address) {
    url
    fields
  }
}
    `;
export const useUpdateNftUploadImageUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateNftUploadImageUrlMutation, TError, UpdateNftUploadImageUrlMutationVariables, TContext>) =>
    useMutation<UpdateNftUploadImageUrlMutation, TError, UpdateNftUploadImageUrlMutationVariables, TContext>(
      ['updateNftUploadImageUrl'],
      (variables?: UpdateNftUploadImageUrlMutationVariables) => fetcher<UpdateNftUploadImageUrlMutation, UpdateNftUploadImageUrlMutationVariables>(UpdateNftUploadImageUrlDocument, variables)(),
      options
    );
useUpdateNftUploadImageUrlMutation.fetcher = (variables: UpdateNftUploadImageUrlMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateNftUploadImageUrlMutation, UpdateNftUploadImageUrlMutationVariables>(UpdateNftUploadImageUrlDocument, variables, options);
export const RequestLoginChallengeDocument = /*#__PURE__*/ `
    mutation RequestLoginChallenge($publicKey: String!) {
  requestLoginChallenge(publicKey: $publicKey) {
    jwt
    signData
  }
}
    `;
export const useRequestLoginChallengeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RequestLoginChallengeMutation, TError, RequestLoginChallengeMutationVariables, TContext>) =>
    useMutation<RequestLoginChallengeMutation, TError, RequestLoginChallengeMutationVariables, TContext>(
      ['RequestLoginChallenge'],
      (variables?: RequestLoginChallengeMutationVariables) => fetcher<RequestLoginChallengeMutation, RequestLoginChallengeMutationVariables>(RequestLoginChallengeDocument, variables)(),
      options
    );
useRequestLoginChallengeMutation.fetcher = (variables: RequestLoginChallengeMutationVariables, options?: RequestInit['headers']) => fetcher<RequestLoginChallengeMutation, RequestLoginChallengeMutationVariables>(RequestLoginChallengeDocument, variables, options);
export const SubmitLoginChallengeDocument = /*#__PURE__*/ `
    mutation SubmitLoginChallenge($jwt: String!, $signature: String!) {
  submitLoginChallenge(jwt: $jwt, signature: $signature)
}
    `;
export const useSubmitLoginChallengeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SubmitLoginChallengeMutation, TError, SubmitLoginChallengeMutationVariables, TContext>) =>
    useMutation<SubmitLoginChallengeMutation, TError, SubmitLoginChallengeMutationVariables, TContext>(
      ['SubmitLoginChallenge'],
      (variables?: SubmitLoginChallengeMutationVariables) => fetcher<SubmitLoginChallengeMutation, SubmitLoginChallengeMutationVariables>(SubmitLoginChallengeDocument, variables)(),
      options
    );
useSubmitLoginChallengeMutation.fetcher = (variables: SubmitLoginChallengeMutationVariables, options?: RequestInit['headers']) => fetcher<SubmitLoginChallengeMutation, SubmitLoginChallengeMutationVariables>(SubmitLoginChallengeDocument, variables, options);
export const MeDocument = /*#__PURE__*/ `
    query Me {
  me {
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: UseQueryOptions<MeQuery, TError, TData>
    ) =>
    useQuery<MeQuery, TError, TData>(
      variables === undefined ? ['Me'] : ['Me', variables],
      fetcher<MeQuery, MeQueryVariables>(MeDocument, variables),
      options
    );

useMeQuery.getKey = (variables?: MeQueryVariables) => variables === undefined ? ['Me'] : ['Me', variables];
;

export const useInfiniteMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      pageParamKey: keyof MeQueryVariables,
      variables?: MeQueryVariables,
      options?: UseInfiniteQueryOptions<MeQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<MeQuery, TError, TData>(
      variables === undefined ? ['Me.infinite'] : ['Me.infinite', variables],
      (metaData) => fetcher<MeQuery, MeQueryVariables>(MeDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteMeQuery.getKey = (variables?: MeQueryVariables) => variables === undefined ? ['Me.infinite'] : ['Me.infinite', variables];
;

useMeQuery.fetcher = (variables?: MeQueryVariables, options?: RequestInit['headers']) => fetcher<MeQuery, MeQueryVariables>(MeDocument, variables, options);
export const GetAppConfigDocument = /*#__PURE__*/ `
    query GetAppConfig {
  getAppConfig {
    rpc
    permissionPackage
    allowlistPackage
    authlistPackage
    requestPackage
    koiskPackage
    liquidityLayerPackage
    liquidityLayerV1Package
    launchpadPackage
    nftProtocolPackage
    launchpadV2Package
    dappPackage
    allowlist
    network
    updatedAt
    commissionBps
    commissionAddress
  }
}
    `;
export const useGetAppConfigQuery = <
      TData = GetAppConfigQuery,
      TError = unknown
    >(
      variables?: GetAppConfigQueryVariables,
      options?: UseQueryOptions<GetAppConfigQuery, TError, TData>
    ) =>
    useQuery<GetAppConfigQuery, TError, TData>(
      variables === undefined ? ['GetAppConfig'] : ['GetAppConfig', variables],
      fetcher<GetAppConfigQuery, GetAppConfigQueryVariables>(GetAppConfigDocument, variables),
      options
    );

useGetAppConfigQuery.getKey = (variables?: GetAppConfigQueryVariables) => variables === undefined ? ['GetAppConfig'] : ['GetAppConfig', variables];
;

export const useInfiniteGetAppConfigQuery = <
      TData = GetAppConfigQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetAppConfigQueryVariables,
      variables?: GetAppConfigQueryVariables,
      options?: UseInfiniteQueryOptions<GetAppConfigQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetAppConfigQuery, TError, TData>(
      variables === undefined ? ['GetAppConfig.infinite'] : ['GetAppConfig.infinite', variables],
      (metaData) => fetcher<GetAppConfigQuery, GetAppConfigQueryVariables>(GetAppConfigDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppConfigQuery.getKey = (variables?: GetAppConfigQueryVariables) => variables === undefined ? ['GetAppConfig.infinite'] : ['GetAppConfig.infinite', variables];
;

useGetAppConfigQuery.fetcher = (variables?: GetAppConfigQueryVariables, options?: RequestInit['headers']) => fetcher<GetAppConfigQuery, GetAppConfigQueryVariables>(GetAppConfigDocument, variables, options);
export const QueryLaunchpadDocument = /*#__PURE__*/ `
    query QueryLaunchpad($id: String!) {
  launchpad(id: $id) {
    ...LaunchpadParts
  }
}
    ${LaunchpadPartsFragmentDoc}`;
export const useQueryLaunchpadQuery = <
      TData = QueryLaunchpadQuery,
      TError = unknown
    >(
      variables: QueryLaunchpadQueryVariables,
      options?: UseQueryOptions<QueryLaunchpadQuery, TError, TData>
    ) =>
    useQuery<QueryLaunchpadQuery, TError, TData>(
      ['QueryLaunchpad', variables],
      fetcher<QueryLaunchpadQuery, QueryLaunchpadQueryVariables>(QueryLaunchpadDocument, variables),
      options
    );

useQueryLaunchpadQuery.getKey = (variables: QueryLaunchpadQueryVariables) => ['QueryLaunchpad', variables];
;

export const useInfiniteQueryLaunchpadQuery = <
      TData = QueryLaunchpadQuery,
      TError = unknown
    >(
      pageParamKey: keyof QueryLaunchpadQueryVariables,
      variables: QueryLaunchpadQueryVariables,
      options?: UseInfiniteQueryOptions<QueryLaunchpadQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<QueryLaunchpadQuery, TError, TData>(
      ['QueryLaunchpad.infinite', variables],
      (metaData) => fetcher<QueryLaunchpadQuery, QueryLaunchpadQueryVariables>(QueryLaunchpadDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteQueryLaunchpadQuery.getKey = (variables: QueryLaunchpadQueryVariables) => ['QueryLaunchpad.infinite', variables];
;

useQueryLaunchpadQuery.fetcher = (variables: QueryLaunchpadQueryVariables, options?: RequestInit['headers']) => fetcher<QueryLaunchpadQuery, QueryLaunchpadQueryVariables>(QueryLaunchpadDocument, variables, options);
export const ListLaunchpadsDocument = /*#__PURE__*/ `
    query ListLaunchpads($limit: Int, $skip: Int, $keyword: String, $owner: String) {
  launchpads(
    paging: {limit: $limit, skip: $skip}
    filter: {keyword: $keyword, owner: $owner}
  ) {
    items {
      ...LaunchpadParts
    }
    totalItems
  }
}
    ${LaunchpadPartsFragmentDoc}`;
export const useListLaunchpadsQuery = <
      TData = ListLaunchpadsQuery,
      TError = unknown
    >(
      variables?: ListLaunchpadsQueryVariables,
      options?: UseQueryOptions<ListLaunchpadsQuery, TError, TData>
    ) =>
    useQuery<ListLaunchpadsQuery, TError, TData>(
      variables === undefined ? ['ListLaunchpads'] : ['ListLaunchpads', variables],
      fetcher<ListLaunchpadsQuery, ListLaunchpadsQueryVariables>(ListLaunchpadsDocument, variables),
      options
    );

useListLaunchpadsQuery.getKey = (variables?: ListLaunchpadsQueryVariables) => variables === undefined ? ['ListLaunchpads'] : ['ListLaunchpads', variables];
;

export const useInfiniteListLaunchpadsQuery = <
      TData = ListLaunchpadsQuery,
      TError = unknown
    >(
      pageParamKey: keyof ListLaunchpadsQueryVariables,
      variables?: ListLaunchpadsQueryVariables,
      options?: UseInfiniteQueryOptions<ListLaunchpadsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<ListLaunchpadsQuery, TError, TData>(
      variables === undefined ? ['ListLaunchpads.infinite'] : ['ListLaunchpads.infinite', variables],
      (metaData) => fetcher<ListLaunchpadsQuery, ListLaunchpadsQueryVariables>(ListLaunchpadsDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteListLaunchpadsQuery.getKey = (variables?: ListLaunchpadsQueryVariables) => variables === undefined ? ['ListLaunchpads.infinite'] : ['ListLaunchpads.infinite', variables];
;

useListLaunchpadsQuery.fetcher = (variables?: ListLaunchpadsQueryVariables, options?: RequestInit['headers']) => fetcher<ListLaunchpadsQuery, ListLaunchpadsQueryVariables>(ListLaunchpadsDocument, variables, options);
export const OnMintDocument = /*#__PURE__*/ `
    mutation onMint($launchpadId: String!, $nftAddress: String!, $txId: String!) {
  onMint(launchpadId: $launchpadId, nftAddress: $nftAddress, txId: $txId)
}
    `;
export const useOnMintMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<OnMintMutation, TError, OnMintMutationVariables, TContext>) =>
    useMutation<OnMintMutation, TError, OnMintMutationVariables, TContext>(
      ['onMint'],
      (variables?: OnMintMutationVariables) => fetcher<OnMintMutation, OnMintMutationVariables>(OnMintDocument, variables)(),
      options
    );
useOnMintMutation.fetcher = (variables: OnMintMutationVariables, options?: RequestInit['headers']) => fetcher<OnMintMutation, OnMintMutationVariables>(OnMintDocument, variables, options);
export const CreateLaunchpadDocument = /*#__PURE__*/ `
    mutation CreateLaunchpad($input: CreateLaunchpadInput!) {
  createLaunchpad(input: $input) {
    ...LaunchpadParts
  }
}
    ${LaunchpadPartsFragmentDoc}`;
export const useCreateLaunchpadMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateLaunchpadMutation, TError, CreateLaunchpadMutationVariables, TContext>) =>
    useMutation<CreateLaunchpadMutation, TError, CreateLaunchpadMutationVariables, TContext>(
      ['CreateLaunchpad'],
      (variables?: CreateLaunchpadMutationVariables) => fetcher<CreateLaunchpadMutation, CreateLaunchpadMutationVariables>(CreateLaunchpadDocument, variables)(),
      options
    );
useCreateLaunchpadMutation.fetcher = (variables: CreateLaunchpadMutationVariables, options?: RequestInit['headers']) => fetcher<CreateLaunchpadMutation, CreateLaunchpadMutationVariables>(CreateLaunchpadDocument, variables, options);
export const UpdateLaunchpadDocument = /*#__PURE__*/ `
    mutation UpdateLaunchpad($id: String!, $input: UpdateLaunchpadInput!) {
  updateLaunchpad(id: $id, input: $input) {
    ...LaunchpadParts
  }
}
    ${LaunchpadPartsFragmentDoc}`;
export const useUpdateLaunchpadMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLaunchpadMutation, TError, UpdateLaunchpadMutationVariables, TContext>) =>
    useMutation<UpdateLaunchpadMutation, TError, UpdateLaunchpadMutationVariables, TContext>(
      ['UpdateLaunchpad'],
      (variables?: UpdateLaunchpadMutationVariables) => fetcher<UpdateLaunchpadMutation, UpdateLaunchpadMutationVariables>(UpdateLaunchpadDocument, variables)(),
      options
    );
useUpdateLaunchpadMutation.fetcher = (variables: UpdateLaunchpadMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLaunchpadMutation, UpdateLaunchpadMutationVariables>(UpdateLaunchpadDocument, variables, options);
export const UpdateLaunchpadImageDocument = /*#__PURE__*/ `
    mutation updateLaunchpadImage($id: String!) {
  updateLaunchpadImage(id: $id) {
    url
    fields
  }
}
    `;
export const useUpdateLaunchpadImageMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLaunchpadImageMutation, TError, UpdateLaunchpadImageMutationVariables, TContext>) =>
    useMutation<UpdateLaunchpadImageMutation, TError, UpdateLaunchpadImageMutationVariables, TContext>(
      ['updateLaunchpadImage'],
      (variables?: UpdateLaunchpadImageMutationVariables) => fetcher<UpdateLaunchpadImageMutation, UpdateLaunchpadImageMutationVariables>(UpdateLaunchpadImageDocument, variables)(),
      options
    );
useUpdateLaunchpadImageMutation.fetcher = (variables: UpdateLaunchpadImageMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLaunchpadImageMutation, UpdateLaunchpadImageMutationVariables>(UpdateLaunchpadImageDocument, variables, options);
export const UpdateLaunchpadCoverDocument = /*#__PURE__*/ `
    mutation updateLaunchpadCover($id: String!) {
  updateLaunchpadCover(id: $id) {
    url
    fields
  }
}
    `;
export const useUpdateLaunchpadCoverMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLaunchpadCoverMutation, TError, UpdateLaunchpadCoverMutationVariables, TContext>) =>
    useMutation<UpdateLaunchpadCoverMutation, TError, UpdateLaunchpadCoverMutationVariables, TContext>(
      ['updateLaunchpadCover'],
      (variables?: UpdateLaunchpadCoverMutationVariables) => fetcher<UpdateLaunchpadCoverMutation, UpdateLaunchpadCoverMutationVariables>(UpdateLaunchpadCoverDocument, variables)(),
      options
    );
useUpdateLaunchpadCoverMutation.fetcher = (variables: UpdateLaunchpadCoverMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLaunchpadCoverMutation, UpdateLaunchpadCoverMutationVariables>(UpdateLaunchpadCoverDocument, variables, options);
export const UpdateLaunchpadLogoDocument = /*#__PURE__*/ `
    mutation updateLaunchpadLogo($id: String!) {
  updateLaunchpadLogo(id: $id) {
    url
    fields
  }
}
    `;
export const useUpdateLaunchpadLogoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLaunchpadLogoMutation, TError, UpdateLaunchpadLogoMutationVariables, TContext>) =>
    useMutation<UpdateLaunchpadLogoMutation, TError, UpdateLaunchpadLogoMutationVariables, TContext>(
      ['updateLaunchpadLogo'],
      (variables?: UpdateLaunchpadLogoMutationVariables) => fetcher<UpdateLaunchpadLogoMutation, UpdateLaunchpadLogoMutationVariables>(UpdateLaunchpadLogoDocument, variables)(),
      options
    );
useUpdateLaunchpadLogoMutation.fetcher = (variables: UpdateLaunchpadLogoMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateLaunchpadLogoMutation, UpdateLaunchpadLogoMutationVariables>(UpdateLaunchpadLogoDocument, variables, options);
export const ListLeaderboardsDocument = /*#__PURE__*/ `
    query ListLeaderboards($limit: Int, $skip: Int) {
  leaderboards(paging: {limit: $limit, skip: $skip}) {
    items {
      user {
        address
        name
        username
        profileUrl
      }
      volume
      point
    }
    totalItems
  }
}
    `;
export const useListLeaderboardsQuery = <
      TData = ListLeaderboardsQuery,
      TError = unknown
    >(
      variables?: ListLeaderboardsQueryVariables,
      options?: UseQueryOptions<ListLeaderboardsQuery, TError, TData>
    ) =>
    useQuery<ListLeaderboardsQuery, TError, TData>(
      variables === undefined ? ['ListLeaderboards'] : ['ListLeaderboards', variables],
      fetcher<ListLeaderboardsQuery, ListLeaderboardsQueryVariables>(ListLeaderboardsDocument, variables),
      options
    );

useListLeaderboardsQuery.getKey = (variables?: ListLeaderboardsQueryVariables) => variables === undefined ? ['ListLeaderboards'] : ['ListLeaderboards', variables];
;

export const useInfiniteListLeaderboardsQuery = <
      TData = ListLeaderboardsQuery,
      TError = unknown
    >(
      pageParamKey: keyof ListLeaderboardsQueryVariables,
      variables?: ListLeaderboardsQueryVariables,
      options?: UseInfiniteQueryOptions<ListLeaderboardsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<ListLeaderboardsQuery, TError, TData>(
      variables === undefined ? ['ListLeaderboards.infinite'] : ['ListLeaderboards.infinite', variables],
      (metaData) => fetcher<ListLeaderboardsQuery, ListLeaderboardsQueryVariables>(ListLeaderboardsDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteListLeaderboardsQuery.getKey = (variables?: ListLeaderboardsQueryVariables) => variables === undefined ? ['ListLeaderboards.infinite'] : ['ListLeaderboards.infinite', variables];
;

useListLeaderboardsQuery.fetcher = (variables?: ListLeaderboardsQueryVariables, options?: RequestInit['headers']) => fetcher<ListLeaderboardsQuery, ListLeaderboardsQueryVariables>(ListLeaderboardsDocument, variables, options);
export const ListNftsDocument = /*#__PURE__*/ `
    query ListNfts($address: String!, $filter: NftFilterInput, $field: NftSortingFields, $order: SortingOrder, $limit: Int, $skip: Int) {
  nfts(
    collectionAddress: $address
    filter: $filter
    sorting: {field: $field, order: $order}
    paging: {limit: $limit, skip: $skip}
  ) {
    items {
      ...NftParts
    }
    totalItems
  }
}
    ${NftPartsFragmentDoc}`;
export const useListNftsQuery = <
      TData = ListNftsQuery,
      TError = unknown
    >(
      variables: ListNftsQueryVariables,
      options?: UseQueryOptions<ListNftsQuery, TError, TData>
    ) =>
    useQuery<ListNftsQuery, TError, TData>(
      ['ListNfts', variables],
      fetcher<ListNftsQuery, ListNftsQueryVariables>(ListNftsDocument, variables),
      options
    );

useListNftsQuery.getKey = (variables: ListNftsQueryVariables) => ['ListNfts', variables];
;

export const useInfiniteListNftsQuery = <
      TData = ListNftsQuery,
      TError = unknown
    >(
      pageParamKey: keyof ListNftsQueryVariables,
      variables: ListNftsQueryVariables,
      options?: UseInfiniteQueryOptions<ListNftsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<ListNftsQuery, TError, TData>(
      ['ListNfts.infinite', variables],
      (metaData) => fetcher<ListNftsQuery, ListNftsQueryVariables>(ListNftsDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteListNftsQuery.getKey = (variables: ListNftsQueryVariables) => ['ListNfts.infinite', variables];
;

useListNftsQuery.fetcher = (variables: ListNftsQueryVariables, options?: RequestInit['headers']) => fetcher<ListNftsQuery, ListNftsQueryVariables>(ListNftsDocument, variables, options);
export const QueryNftDocument = /*#__PURE__*/ `
    query QueryNft($address: String!) {
  nft(address: $address) {
    ...NftParts
    collection {
      name
      address
      imageUrl
      royalty
      stats {
        floor
      }
      description
      orderbook
      type
      creators {
        user {
          address
        }
        share
      }
    }
    events {
      id
      type
      txId
      price
      createdAt
      originOwner {
        address
      }
      newOwner {
        address
      }
    }
  }
}
    ${NftPartsFragmentDoc}`;
export const useQueryNftQuery = <
      TData = QueryNftQuery,
      TError = unknown
    >(
      variables: QueryNftQueryVariables,
      options?: UseQueryOptions<QueryNftQuery, TError, TData>
    ) =>
    useQuery<QueryNftQuery, TError, TData>(
      ['QueryNft', variables],
      fetcher<QueryNftQuery, QueryNftQueryVariables>(QueryNftDocument, variables),
      options
    );

useQueryNftQuery.getKey = (variables: QueryNftQueryVariables) => ['QueryNft', variables];
;

export const useInfiniteQueryNftQuery = <
      TData = QueryNftQuery,
      TError = unknown
    >(
      pageParamKey: keyof QueryNftQueryVariables,
      variables: QueryNftQueryVariables,
      options?: UseInfiniteQueryOptions<QueryNftQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<QueryNftQuery, TError, TData>(
      ['QueryNft.infinite', variables],
      (metaData) => fetcher<QueryNftQuery, QueryNftQueryVariables>(QueryNftDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteQueryNftQuery.getKey = (variables: QueryNftQueryVariables) => ['QueryNft.infinite', variables];
;

useQueryNftQuery.fetcher = (variables: QueryNftQueryVariables, options?: RequestInit['headers']) => fetcher<QueryNftQuery, QueryNftQueryVariables>(QueryNftDocument, variables, options);
export const GetNftsByOwnerDocument = /*#__PURE__*/ `
    query getNftsByOwner($owner: String!, $field: NftSortingFields, $collectionAddress: String, $order: SortingOrder, $limit: Int, $skip: Int, $listedFilter: NftsByOwnerListedFilter) {
  nftsByOwner(
    owner: $owner
    sorting: {field: $field, order: $order}
    paging: {limit: $limit, skip: $skip}
    listedFilter: $listedFilter
    collectionAddress: $collectionAddress
  ) {
    items {
      ...NftParts
    }
    totalItems
  }
}
    ${NftPartsFragmentDoc}`;
export const useGetNftsByOwnerQuery = <
      TData = GetNftsByOwnerQuery,
      TError = unknown
    >(
      variables: GetNftsByOwnerQueryVariables,
      options?: UseQueryOptions<GetNftsByOwnerQuery, TError, TData>
    ) =>
    useQuery<GetNftsByOwnerQuery, TError, TData>(
      ['getNftsByOwner', variables],
      fetcher<GetNftsByOwnerQuery, GetNftsByOwnerQueryVariables>(GetNftsByOwnerDocument, variables),
      options
    );

useGetNftsByOwnerQuery.getKey = (variables: GetNftsByOwnerQueryVariables) => ['getNftsByOwner', variables];
;

export const useInfiniteGetNftsByOwnerQuery = <
      TData = GetNftsByOwnerQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetNftsByOwnerQueryVariables,
      variables: GetNftsByOwnerQueryVariables,
      options?: UseInfiniteQueryOptions<GetNftsByOwnerQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetNftsByOwnerQuery, TError, TData>(
      ['getNftsByOwner.infinite', variables],
      (metaData) => fetcher<GetNftsByOwnerQuery, GetNftsByOwnerQueryVariables>(GetNftsByOwnerDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteGetNftsByOwnerQuery.getKey = (variables: GetNftsByOwnerQueryVariables) => ['getNftsByOwner.infinite', variables];
;

useGetNftsByOwnerQuery.fetcher = (variables: GetNftsByOwnerQueryVariables, options?: RequestInit['headers']) => fetcher<GetNftsByOwnerQuery, GetNftsByOwnerQueryVariables>(GetNftsByOwnerDocument, variables, options);
export const IndexNftDocument = /*#__PURE__*/ `
    mutation IndexNft($address: String!) {
  indexNft(address: $address)
}
    `;
export const useIndexNftMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<IndexNftMutation, TError, IndexNftMutationVariables, TContext>) =>
    useMutation<IndexNftMutation, TError, IndexNftMutationVariables, TContext>(
      ['IndexNft'],
      (variables?: IndexNftMutationVariables) => fetcher<IndexNftMutation, IndexNftMutationVariables>(IndexNftDocument, variables)(),
      options
    );
useIndexNftMutation.fetcher = (variables: IndexNftMutationVariables, options?: RequestInit['headers']) => fetcher<IndexNftMutation, IndexNftMutationVariables>(IndexNftDocument, variables, options);
export const SubscribeNftEventDocument = /*#__PURE__*/ `
    subscription SubscribeNftEvent($address: String!) {
  subscribeNftEvent(nftAddress: $address) {
    type
    txId
    price
    createdAt
    originOwner {
      address
    }
    newOwner {
      address
    }
  }
}
    `;
export const GetUserDocument = /*#__PURE__*/ `
    query getUser($address: String!) {
  user(address: $address) {
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export const useGetUserQuery = <
      TData = GetUserQuery,
      TError = unknown
    >(
      variables: GetUserQueryVariables,
      options?: UseQueryOptions<GetUserQuery, TError, TData>
    ) =>
    useQuery<GetUserQuery, TError, TData>(
      ['getUser', variables],
      fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables),
      options
    );

useGetUserQuery.getKey = (variables: GetUserQueryVariables) => ['getUser', variables];
;

export const useInfiniteGetUserQuery = <
      TData = GetUserQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetUserQueryVariables,
      variables: GetUserQueryVariables,
      options?: UseInfiniteQueryOptions<GetUserQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetUserQuery, TError, TData>(
      ['getUser.infinite', variables],
      (metaData) => fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteGetUserQuery.getKey = (variables: GetUserQueryVariables) => ['getUser.infinite', variables];
;

useGetUserQuery.fetcher = (variables: GetUserQueryVariables, options?: RequestInit['headers']) => fetcher<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options);
export const UpdateProfileDocument = /*#__PURE__*/ `
    mutation updateProfile($input: UpdateUserInput!) {
  updateUser(input: $input) {
    address
    profileUrl
    name
    username
  }
}
    `;
export const useUpdateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>) =>
    useMutation<UpdateProfileMutation, TError, UpdateProfileMutationVariables, TContext>(
      ['updateProfile'],
      (variables?: UpdateProfileMutationVariables) => fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, variables)(),
      options
    );
useUpdateProfileMutation.fetcher = (variables: UpdateProfileMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, variables, options);
export const UpdateUserProfileImageDocument = /*#__PURE__*/ `
    mutation updateUserProfileImage {
  updateUserProfileImage {
    url
    fields
  }
}
    `;
export const useUpdateUserProfileImageMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserProfileImageMutation, TError, UpdateUserProfileImageMutationVariables, TContext>) =>
    useMutation<UpdateUserProfileImageMutation, TError, UpdateUserProfileImageMutationVariables, TContext>(
      ['updateUserProfileImage'],
      (variables?: UpdateUserProfileImageMutationVariables) => fetcher<UpdateUserProfileImageMutation, UpdateUserProfileImageMutationVariables>(UpdateUserProfileImageDocument, variables)(),
      options
    );
useUpdateUserProfileImageMutation.fetcher = (variables?: UpdateUserProfileImageMutationVariables, options?: RequestInit['headers']) => fetcher<UpdateUserProfileImageMutation, UpdateUserProfileImageMutationVariables>(UpdateUserProfileImageDocument, variables, options);
export const ConnectDiscordDocument = /*#__PURE__*/ `
    mutation connectDiscord($code: String!, $redirectUri: String!) {
  connectDiscord(code: $code, redirectUri: $redirectUri)
}
    `;
export const useConnectDiscordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ConnectDiscordMutation, TError, ConnectDiscordMutationVariables, TContext>) =>
    useMutation<ConnectDiscordMutation, TError, ConnectDiscordMutationVariables, TContext>(
      ['connectDiscord'],
      (variables?: ConnectDiscordMutationVariables) => fetcher<ConnectDiscordMutation, ConnectDiscordMutationVariables>(ConnectDiscordDocument, variables)(),
      options
    );
useConnectDiscordMutation.fetcher = (variables: ConnectDiscordMutationVariables, options?: RequestInit['headers']) => fetcher<ConnectDiscordMutation, ConnectDiscordMutationVariables>(ConnectDiscordDocument, variables, options);
export const RequestTwitterOAuthCodeDocument = /*#__PURE__*/ `
    query requestTwitterOAuthCode($redirectUrl: String!) {
  requestTwitterOAuthCode(redirectUrl: $redirectUrl) {
    oauthToken
    oauthTokenSecret
    oauthCallbackConfirmed
  }
}
    `;
export const useRequestTwitterOAuthCodeQuery = <
      TData = RequestTwitterOAuthCodeQuery,
      TError = unknown
    >(
      variables: RequestTwitterOAuthCodeQueryVariables,
      options?: UseQueryOptions<RequestTwitterOAuthCodeQuery, TError, TData>
    ) =>
    useQuery<RequestTwitterOAuthCodeQuery, TError, TData>(
      ['requestTwitterOAuthCode', variables],
      fetcher<RequestTwitterOAuthCodeQuery, RequestTwitterOAuthCodeQueryVariables>(RequestTwitterOAuthCodeDocument, variables),
      options
    );

useRequestTwitterOAuthCodeQuery.getKey = (variables: RequestTwitterOAuthCodeQueryVariables) => ['requestTwitterOAuthCode', variables];
;

export const useInfiniteRequestTwitterOAuthCodeQuery = <
      TData = RequestTwitterOAuthCodeQuery,
      TError = unknown
    >(
      pageParamKey: keyof RequestTwitterOAuthCodeQueryVariables,
      variables: RequestTwitterOAuthCodeQueryVariables,
      options?: UseInfiniteQueryOptions<RequestTwitterOAuthCodeQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<RequestTwitterOAuthCodeQuery, TError, TData>(
      ['requestTwitterOAuthCode.infinite', variables],
      (metaData) => fetcher<RequestTwitterOAuthCodeQuery, RequestTwitterOAuthCodeQueryVariables>(RequestTwitterOAuthCodeDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteRequestTwitterOAuthCodeQuery.getKey = (variables: RequestTwitterOAuthCodeQueryVariables) => ['requestTwitterOAuthCode.infinite', variables];
;

useRequestTwitterOAuthCodeQuery.fetcher = (variables: RequestTwitterOAuthCodeQueryVariables, options?: RequestInit['headers']) => fetcher<RequestTwitterOAuthCodeQuery, RequestTwitterOAuthCodeQueryVariables>(RequestTwitterOAuthCodeDocument, variables, options);
export const ConnectTwitterDocument = /*#__PURE__*/ `
    mutation connectTwitter($oauthToken: String!, $oauthVerifier: String!) {
  connectTwitter(oauthToken: $oauthToken, oauthVerifier: $oauthVerifier)
}
    `;
export const useConnectTwitterMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ConnectTwitterMutation, TError, ConnectTwitterMutationVariables, TContext>) =>
    useMutation<ConnectTwitterMutation, TError, ConnectTwitterMutationVariables, TContext>(
      ['connectTwitter'],
      (variables?: ConnectTwitterMutationVariables) => fetcher<ConnectTwitterMutation, ConnectTwitterMutationVariables>(ConnectTwitterDocument, variables)(),
      options
    );
useConnectTwitterMutation.fetcher = (variables: ConnectTwitterMutationVariables, options?: RequestInit['headers']) => fetcher<ConnectTwitterMutation, ConnectTwitterMutationVariables>(ConnectTwitterDocument, variables, options);
export const DisconnectTwitterDocument = /*#__PURE__*/ `
    mutation disconnectTwitter {
  disconnectTwitter
}
    `;
export const useDisconnectTwitterMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DisconnectTwitterMutation, TError, DisconnectTwitterMutationVariables, TContext>) =>
    useMutation<DisconnectTwitterMutation, TError, DisconnectTwitterMutationVariables, TContext>(
      ['disconnectTwitter'],
      (variables?: DisconnectTwitterMutationVariables) => fetcher<DisconnectTwitterMutation, DisconnectTwitterMutationVariables>(DisconnectTwitterDocument, variables)(),
      options
    );
useDisconnectTwitterMutation.fetcher = (variables?: DisconnectTwitterMutationVariables, options?: RequestInit['headers']) => fetcher<DisconnectTwitterMutation, DisconnectTwitterMutationVariables>(DisconnectTwitterDocument, variables, options);
export const DisconnectDiscordDocument = /*#__PURE__*/ `
    mutation disconnectDiscord {
  disconnectDiscord
}
    `;
export const useDisconnectDiscordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DisconnectDiscordMutation, TError, DisconnectDiscordMutationVariables, TContext>) =>
    useMutation<DisconnectDiscordMutation, TError, DisconnectDiscordMutationVariables, TContext>(
      ['disconnectDiscord'],
      (variables?: DisconnectDiscordMutationVariables) => fetcher<DisconnectDiscordMutation, DisconnectDiscordMutationVariables>(DisconnectDiscordDocument, variables)(),
      options
    );
useDisconnectDiscordMutation.fetcher = (variables?: DisconnectDiscordMutationVariables, options?: RequestInit['headers']) => fetcher<DisconnectDiscordMutation, DisconnectDiscordMutationVariables>(DisconnectDiscordDocument, variables, options);
export const GetNotificationsDocument = /*#__PURE__*/ `
    query GetNotifications($skip: Int, $limit: Int) {
  notifications(paging: {skip: $skip, limit: $limit}) {
    items {
      id
      type
      createdAt
      title
      body
      metadata
      readAt
      completedAt
    }
    totalItems
  }
}
    `;
export const useGetNotificationsQuery = <
      TData = GetNotificationsQuery,
      TError = unknown
    >(
      variables?: GetNotificationsQueryVariables,
      options?: UseQueryOptions<GetNotificationsQuery, TError, TData>
    ) =>
    useQuery<GetNotificationsQuery, TError, TData>(
      variables === undefined ? ['GetNotifications'] : ['GetNotifications', variables],
      fetcher<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, variables),
      options
    );

useGetNotificationsQuery.getKey = (variables?: GetNotificationsQueryVariables) => variables === undefined ? ['GetNotifications'] : ['GetNotifications', variables];
;

export const useInfiniteGetNotificationsQuery = <
      TData = GetNotificationsQuery,
      TError = unknown
    >(
      pageParamKey: keyof GetNotificationsQueryVariables,
      variables?: GetNotificationsQueryVariables,
      options?: UseInfiniteQueryOptions<GetNotificationsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<GetNotificationsQuery, TError, TData>(
      variables === undefined ? ['GetNotifications.infinite'] : ['GetNotifications.infinite', variables],
      (metaData) => fetcher<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),
      options
    )};


useInfiniteGetNotificationsQuery.getKey = (variables?: GetNotificationsQueryVariables) => variables === undefined ? ['GetNotifications.infinite'] : ['GetNotifications.infinite', variables];
;

useGetNotificationsQuery.fetcher = (variables?: GetNotificationsQueryVariables, options?: RequestInit['headers']) => fetcher<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, variables, options);
export const DismissNotificationDocument = /*#__PURE__*/ `
    mutation dismissNotification($id: String!) {
  dismissNotification(id: $id)
}
    `;
export const useDismissNotificationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DismissNotificationMutation, TError, DismissNotificationMutationVariables, TContext>) =>
    useMutation<DismissNotificationMutation, TError, DismissNotificationMutationVariables, TContext>(
      ['dismissNotification'],
      (variables?: DismissNotificationMutationVariables) => fetcher<DismissNotificationMutation, DismissNotificationMutationVariables>(DismissNotificationDocument, variables)(),
      options
    );
useDismissNotificationMutation.fetcher = (variables: DismissNotificationMutationVariables, options?: RequestInit['headers']) => fetcher<DismissNotificationMutation, DismissNotificationMutationVariables>(DismissNotificationDocument, variables, options);
export const DismissAllNotificationDocument = /*#__PURE__*/ `
    mutation dismissAllNotification {
  dismissAllNotification
}
    `;
export const useDismissAllNotificationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DismissAllNotificationMutation, TError, DismissAllNotificationMutationVariables, TContext>) =>
    useMutation<DismissAllNotificationMutation, TError, DismissAllNotificationMutationVariables, TContext>(
      ['dismissAllNotification'],
      (variables?: DismissAllNotificationMutationVariables) => fetcher<DismissAllNotificationMutation, DismissAllNotificationMutationVariables>(DismissAllNotificationDocument, variables)(),
      options
    );
useDismissAllNotificationMutation.fetcher = (variables?: DismissAllNotificationMutationVariables, options?: RequestInit['headers']) => fetcher<DismissAllNotificationMutation, DismissAllNotificationMutationVariables>(DismissAllNotificationDocument, variables, options);
export const CompleteNotificationDocument = /*#__PURE__*/ `
    mutation completeNotification($id: String!) {
  completeNotification(id: $id)
}
    `;
export const useCompleteNotificationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CompleteNotificationMutation, TError, CompleteNotificationMutationVariables, TContext>) =>
    useMutation<CompleteNotificationMutation, TError, CompleteNotificationMutationVariables, TContext>(
      ['completeNotification'],
      (variables?: CompleteNotificationMutationVariables) => fetcher<CompleteNotificationMutation, CompleteNotificationMutationVariables>(CompleteNotificationDocument, variables)(),
      options
    );
useCompleteNotificationMutation.fetcher = (variables: CompleteNotificationMutationVariables, options?: RequestInit['headers']) => fetcher<CompleteNotificationMutation, CompleteNotificationMutationVariables>(CompleteNotificationDocument, variables, options);
export const SubscribeToNotificationsDocument = /*#__PURE__*/ `
    subscription SubscribeToNotifications {
  subscribeNotification {
    id
    type
    createdAt
    title
    body
    metadata
    readAt
    completedAt
  }
}
    `;