/* eslint-disable */
// @ts-ignore
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Map: { input: any; output: any; }
  NotificationMetadata: { input: any; output: any; }
  Price: { input: any; output: any; }
};

export type AwsPresignedPost = {
  __typename?: 'AWSPresignedPost';
  fields: Scalars['Map']['output'];
  url: Scalars['String']['output'];
};

export type AdminCreateUserInput = {
  address: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  role: Role;
  twitter?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type AdminUpdateUserInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type AppConfig = {
  __typename?: 'AppConfig';
  allowlist?: Maybe<Scalars['String']['output']>;
  allowlistPackage?: Maybe<Scalars['String']['output']>;
  authlistPackage?: Maybe<Scalars['String']['output']>;
  commissionAddress?: Maybe<Scalars['String']['output']>;
  commissionBps?: Maybe<Scalars['String']['output']>;
  dappPackage?: Maybe<Scalars['String']['output']>;
  dappPackages?: Maybe<Array<Scalars['String']['output']>>;
  explorerRpc?: Maybe<Scalars['String']['output']>;
  koiskPackage?: Maybe<Scalars['String']['output']>;
  launchpadPackage?: Maybe<Scalars['String']['output']>;
  launchpadV2Package?: Maybe<Scalars['String']['output']>;
  liquidityLayerPackage?: Maybe<Scalars['String']['output']>;
  liquidityLayerV1Package?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  nftProtocolPackage?: Maybe<Scalars['String']['output']>;
  permissionPackage?: Maybe<Scalars['String']['output']>;
  privateRpc?: Maybe<Scalars['String']['output']>;
  requestPackage?: Maybe<Scalars['String']['output']>;
  rpc?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wsRpc?: Maybe<Scalars['String']['output']>;
};

export type Candlestick = {
  __typename?: 'Candlestick';
  c: Scalars['Float']['output'];
  h: Scalars['Float']['output'];
  l: Scalars['Float']['output'];
  o: Scalars['Float']['output'];
  ts: Scalars['Float']['output'];
  v: Scalars['Float']['output'];
};

export type Collection = {
  __typename?: 'Collection';
  address: Scalars['ID']['output'];
  attributes: Array<CollectionAttribute>;
  bpsRoyaltyStrategy?: Maybe<Scalars['String']['output']>;
  collectionBidStats: CollectionBidStats;
  collectionObject?: Maybe<Scalars['String']['output']>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  creators?: Maybe<Array<Maybe<Creator>>>;
  description?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  myCollecitonBid: Array<CollectionBid>;
  name: Scalars['String']['output'];
  orderbook?: Maybe<Scalars['String']['output']>;
  orderbookType?: Maybe<OrderbookType>;
  /** @deprecated Use type */
  packageModule?: Maybe<Scalars['String']['output']>;
  royalty?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  /** @deprecated Use orderbook and orderbookType */
  somisOrderbook?: Maybe<Scalars['String']['output']>;
  stats?: Maybe<CollectionStats>;
  transferAllowlist?: Maybe<Scalars['String']['output']>;
  transferPolicy?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  whitelisted?: Maybe<Scalars['Boolean']['output']>;
  withdrawPolicy?: Maybe<Scalars['String']['output']>;
};

export type CollectionAttribute = {
  __typename?: 'CollectionAttribute';
  name?: Maybe<Scalars['String']['output']>;
  values: Array<NftAttribute>;
};

export type CollectionBid = {
  __typename?: 'CollectionBid';
  bidder: User;
  bidderKiosk?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  price: Scalars['Price']['output'];
};

export type CollectionBidStats = {
  __typename?: 'CollectionBidStats';
  items: Array<CollectionBidStatsItem>;
};

export type CollectionBidStatsItem = {
  __typename?: 'CollectionBidStatsItem';
  numberOfBid: Scalars['Int']['output'];
  owner: Scalars['Int']['output'];
  price: Scalars['String']['output'];
};

export type CollectionChartDataInput = {
  address: Scalars['String']['input'];
  from: Scalars['DateTime']['input'];
  interval: Scalars['Int']['input'];
  intervalUnit: IntervalUnit;
  to: Scalars['DateTime']['input'];
};

export type CollectionFilterInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CollectionScatterChartData = {
  __typename?: 'CollectionScatterChartData';
  p: Scalars['Float']['output'];
  ts: Scalars['Float']['output'];
};

export type CollectionScatterChartDataInput = {
  address: Scalars['String']['input'];
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

export type CollectionSortingFields =
  | 'FLOOR'
  | 'NAME'
  | 'TOTAL_ITEMS'
  | 'TOTAL_VOL'
  | 'VOL24'
  | 'VOL24_DELTA';

export type CollectionSortingInput = {
  field?: InputMaybe<CollectionSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type CollectionStats = {
  __typename?: 'CollectionStats';
  floor?: Maybe<Scalars['String']['output']>;
  listedItem: Scalars['Int']['output'];
  owners: Scalars['Int']['output'];
  totalItems: Scalars['Int']['output'];
  totalVol?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vol7D?: Maybe<Scalars['String']['output']>;
  vol24: Scalars['String']['output'];
  vol24Delta?: Maybe<Scalars['String']['output']>;
  vol30D?: Maybe<Scalars['String']['output']>;
};

export type CollectionsResult = PagingResult & {
  __typename?: 'CollectionsResult';
  items: Array<Collection>;
  totalItems: Scalars['Int']['output'];
};

export type CreateCollectionInput = {
  address: Scalars['String']['input'];
  bpsRoyaltyStrategy?: InputMaybe<Scalars['String']['input']>;
  collectionObject?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discord?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderbook?: InputMaybe<Scalars['String']['input']>;
  orderbookType?: InputMaybe<OrderbookType>;
  packageModule?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  somisOrderbook?: InputMaybe<Scalars['String']['input']>;
  transferAllowlist?: InputMaybe<Scalars['String']['input']>;
  transferPolicy?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
  withdrawPolicy?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLaunchpadInput = {
  borrowPolicy?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  collectionAddress?: InputMaybe<Scalars['String']['input']>;
  discord?: InputMaybe<Scalars['String']['input']>;
  flags?: InputMaybe<Array<FlagInput>>;
  hatchDate?: InputMaybe<Scalars['DateTime']['input']>;
  hatchMetadata?: InputMaybe<Array<HatchMetadataInput>>;
  launchDate?: InputMaybe<Scalars['DateTime']['input']>;
  launchpadAddress?: InputMaybe<Scalars['String']['input']>;
  listing?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<Scalars['String']['input']>;
  metadataStore?: InputMaybe<Scalars['String']['input']>;
  mintPrice?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  royalty?: InputMaybe<Scalars['Int']['input']>;
  sections?: InputMaybe<Array<SectionInput>>;
  supply?: InputMaybe<Scalars['Int']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  venue?: InputMaybe<Scalars['String']['input']>;
  venues?: InputMaybe<Array<VenueInput>>;
  warehouse?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
  zealyApiKey?: InputMaybe<Scalars['String']['input']>;
  zealySubdomain?: InputMaybe<Scalars['String']['input']>;
  zealyXp?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateNftEventInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  newOwner?: InputMaybe<Scalars['String']['input']>;
  originOwner?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Price']['input']>;
  txId?: InputMaybe<Scalars['String']['input']>;
  type: NftEventType;
};

export type Creator = {
  __typename?: 'Creator';
  share?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
};

export type Flag = {
  __typename?: 'Flag';
  included: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type FlagInput = {
  included: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type HatchMetadata = {
  __typename?: 'HatchMetadata';
  attributes?: Maybe<Array<HatchMetadataAttribute>>;
  description: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type HatchMetadataAttribute = {
  __typename?: 'HatchMetadataAttribute';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type HatchMetadataAttributeInput = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type HatchMetadataInput = {
  attributes: Array<HatchMetadataAttributeInput>;
  description: Scalars['String']['input'];
  imageUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type IntervalUnit =
  | 'DAY'
  | 'HOUR'
  | 'MIN';

export type Launchpad = {
  __typename?: 'Launchpad';
  borrowPolicy?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  collection?: Maybe<Collection>;
  collectionAddress?: Maybe<Scalars['String']['output']>;
  coverUrl: Scalars['String']['output'];
  /** @deprecated use zealySubdomain */
  crew3Subdomain?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  flags?: Maybe<Array<Flag>>;
  hatchDate?: Maybe<Scalars['DateTime']['output']>;
  hatchMetadata?: Maybe<Array<HatchMetadata>>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  items?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use vanues */
  launchDate?: Maybe<Scalars['DateTime']['output']>;
  listing?: Maybe<Scalars['String']['output']>;
  logoUrl: Scalars['String']['output'];
  market?: Maybe<Scalars['String']['output']>;
  metadataStore?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use vanues */
  mintPrice?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  owners?: Maybe<Scalars['Int']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  royalty?: Maybe<Scalars['Int']['output']>;
  sections?: Maybe<Array<Section>>;
  supply?: Maybe<Scalars['Int']['output']>;
  totalSales?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use vanues */
  venue?: Maybe<Scalars['String']['output']>;
  venues?: Maybe<Array<Venue>>;
  warehouse?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  whitelisted?: Maybe<Scalars['Boolean']['output']>;
  zealyApiKey?: Maybe<Scalars['String']['output']>;
  zealySubdomain?: Maybe<Scalars['String']['output']>;
  zealyXp?: Maybe<Scalars['Int']['output']>;
};

export type LaunchpadFilterInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LaunchpadsResult = PagingResult & {
  __typename?: 'LaunchpadsResult';
  items: Array<Launchpad>;
  totalItems: Scalars['Int']['output'];
};

export type LeaderboardRecord = {
  __typename?: 'LeaderboardRecord';
  point: Scalars['Float']['output'];
  user: User;
  volume: Scalars['Float']['output'];
};

export type LeaderboardResult = {
  __typename?: 'LeaderboardResult';
  items: Array<LeaderboardRecord>;
  totalItems: Scalars['Int']['output'];
};

export type LoginChallenge = {
  __typename?: 'LoginChallenge';
  jwt: Scalars['String']['output'];
  signData: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  adminCreateUser: User;
  adminDeleteUser: User;
  adminUpdateUser: User;
  adminUpdateUserCoverImage: AwsPresignedPost;
  adminUpdateUserProfileImage: AwsPresignedPost;
  completeNotification?: Maybe<Scalars['Boolean']['output']>;
  connectDiscord: Scalars['Boolean']['output'];
  connectTwitter: Scalars['Boolean']['output'];
  createCollection: Collection;
  createLaunchpad: Launchpad;
  createNftEvent: NftEvent;
  deleteCollection: Collection;
  deleteLaunchpad: Launchpad;
  deleteNftEvent: NftEvent;
  disconnectDiscord: Scalars['Boolean']['output'];
  disconnectTwitter: Scalars['Boolean']['output'];
  dismissAllNotification?: Maybe<Scalars['Boolean']['output']>;
  dismissNotification?: Maybe<Scalars['Boolean']['output']>;
  getNftUploadImageUrl: AwsPresignedPost;
  indexCollection?: Maybe<Scalars['Boolean']['output']>;
  indexCollectionByContract?: Maybe<Scalars['Boolean']['output']>;
  indexNft?: Maybe<Scalars['Boolean']['output']>;
  indexWallet: Scalars['Boolean']['output'];
  onMint: Scalars['Boolean']['output'];
  requestLoginChallenge: LoginChallenge;
  submitLoginChallenge: Scalars['String']['output'];
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
  address: Scalars['String']['input'];
};


export type MutationAdminUpdateUserArgs = {
  address: Scalars['String']['input'];
  input: AdminUpdateUserInput;
};


export type MutationAdminUpdateUserCoverImageArgs = {
  address: Scalars['String']['input'];
};


export type MutationAdminUpdateUserProfileImageArgs = {
  address: Scalars['String']['input'];
};


export type MutationCompleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationConnectDiscordArgs = {
  code: Scalars['String']['input'];
  redirectUri: Scalars['String']['input'];
};


export type MutationConnectTwitterArgs = {
  oauthToken: Scalars['String']['input'];
  oauthVerifier: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateLaunchpadArgs = {
  input: CreateLaunchpadInput;
};


export type MutationCreateNftEventArgs = {
  input: CreateNftEventInput;
  nftAddress: Scalars['String']['input'];
};


export type MutationDeleteCollectionArgs = {
  address: Scalars['String']['input'];
};


export type MutationDeleteLaunchpadArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNftEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDismissNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationGetNftUploadImageUrlArgs = {
  address: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationIndexCollectionArgs = {
  address: Scalars['String']['input'];
};


export type MutationIndexCollectionByContractArgs = {
  address: Scalars['String']['input'];
};


export type MutationIndexNftArgs = {
  address: Scalars['String']['input'];
};


export type MutationIndexWalletArgs = {
  address: Scalars['String']['input'];
};


export type MutationOnMintArgs = {
  launchpadId: Scalars['String']['input'];
  nftAddress: Scalars['String']['input'];
  txId: Scalars['String']['input'];
};


export type MutationRequestLoginChallengeArgs = {
  publicKey: Scalars['String']['input'];
};


export type MutationSubmitLoginChallengeArgs = {
  jwt: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};


export type MutationUpdateAppConfigArgs = {
  input: UpdateAppConfigInput;
};


export type MutationUpdateCollectionArgs = {
  address: Scalars['String']['input'];
  input: UpdateCollectionInput;
};


export type MutationUpdateCollectionCoverUrlArgs = {
  address: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCollectionImageUrlArgs = {
  address: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCollectionLogoUrlArgs = {
  address: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateLaunchpadArgs = {
  id: Scalars['String']['input'];
  input: UpdateLaunchpadInput;
};


export type MutationUpdateLaunchpadCoverArgs = {
  id: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateLaunchpadImageArgs = {
  id: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateLaunchpadLogoArgs = {
  id: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateNftEventArgs = {
  id: Scalars['String']['input'];
  input: UpdateNftEventInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Nft = {
  __typename?: 'Nft';
  address: Scalars['ID']['output'];
  attributes?: Maybe<Array<NftAttribute>>;
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars['String']['output']>;
  events: Array<NftEvent>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Order>;
  owner?: Maybe<User>;
  type?: Maybe<Scalars['String']['output']>;
};

export type NftAttribute = {
  __typename?: 'NftAttribute';
  floor?: Maybe<Scalars['String']['output']>;
  items: Scalars['Int']['output'];
  lastSale?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  percentage?: Maybe<Scalars['Float']['output']>;
  value: Scalars['String']['output'];
};

export type NftAttributesFilter = {
  name: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type NftEvent = {
  __typename?: 'NftEvent';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** @deprecated Field no longer supported */
  id: Scalars['String']['output'];
  newOwner?: Maybe<User>;
  originOwner?: Maybe<User>;
  price?: Maybe<Scalars['String']['output']>;
  txId: Scalars['ID']['output'];
  type: NftEventType;
  user?: Maybe<User>;
};

export type NftEventResult = PagingResult & {
  __typename?: 'NftEventResult';
  items: Array<NftEvent>;
  totalItems: Scalars['Int']['output'];
};

export type NftEventType =
  | 'ACCEPT_OFFER'
  | 'BID'
  | 'BURN'
  | 'BUY'
  | 'CANCEL_AUCTION'
  | 'CANCEL_BID'
  | 'CANCEL_COLLECTION_BID'
  | 'CANCEL_OFFER'
  | 'CANCEL_ORDER'
  | 'CREATE_AUCTION'
  | 'CREATE_COLLECTION_BID'
  | 'FULFILL_COLLECTION_BID'
  | 'LIST'
  | 'MINT'
  | 'OFFER'
  | 'TRANSFER';

export type NftFilterInput = {
  attributes?: InputMaybe<Array<NftAttributesFilter>>;
  excludeOwned?: InputMaybe<Scalars['Boolean']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  listedOnly?: InputMaybe<Scalars['Boolean']['input']>;
  maxPrice?: InputMaybe<Scalars['Price']['input']>;
  minPrice?: InputMaybe<Scalars['Price']['input']>;
};

export type NftResult = PagingResult & {
  __typename?: 'NftResult';
  items: Array<Nft>;
  totalItems: Scalars['Int']['output'];
};

export type NftSortingFields =
  | 'NAME'
  | 'PRICE';

export type NftSortingInput = {
  field?: InputMaybe<NftSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type NftsByOwnerListedFilter =
  | 'ALL'
  | 'LISTED'
  | 'UNLISTED';

export type Notification = {
  __typename?: 'Notification';
  body?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['NotificationMetadata']['output']>;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type: NotificationType;
};

export type NotificationResult = PagingResult & {
  __typename?: 'NotificationResult';
  items: Array<Notification>;
  totalItems: Scalars['Int']['output'];
};

export type NotificationType =
  | 'BID_FULFILLED'
  | 'BID_LOST'
  | 'CREW3_XP_RECEIVED'
  | 'NFT_SOLD'
  | 'OTHER'
  | 'WELCOME';

export type Order = {
  __typename?: 'Order';
  collectionAddress: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  nft: Nft;
  nftAddress: Scalars['String']['output'];
  orderbook: Scalars['String']['output'];
  orderbookType: OrderbookType;
  price: Scalars['Price']['output'];
  seller: User;
  sellerKiosk?: Maybe<Scalars['String']['output']>;
};

export type OrderEvent = {
  __typename?: 'OrderEvent';
  nft: Nft;
  order?: Maybe<Order>;
  type: OrderEventType;
};

export type OrderEventType =
  | 'NEW'
  | 'REMOVED';

export type OrderSortingFields =
  | 'CREATED_AT'
  | 'PRICE';

export type OrderSortingInput = {
  field?: InputMaybe<OrderSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type OrderbookType =
  | 'OB'
  | 'OB_V1'
  | 'SOMIS';

export type OrdersResult = PagingResult & {
  __typename?: 'OrdersResult';
  items: Array<Order>;
  totalItems: Scalars['Int']['output'];
};

export type OwnedCollection = {
  __typename?: 'OwnedCollection';
  collection: Collection;
  ownedItems: Scalars['Int']['output'];
};

export type PagingInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type PagingResult = {
  totalItems: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
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
  address?: InputMaybe<Scalars['String']['input']>;
  addressOrSlug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCollectionChartDataArgs = {
  input: CollectionChartDataInput;
};


export type QueryCollectionEventsArgs = {
  address: Scalars['String']['input'];
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
  owner: Scalars['String']['input'];
};


export type QueryLaunchpadArgs = {
  id: Scalars['String']['input'];
};


export type QueryLaunchpadsArgs = {
  filter?: InputMaybe<LaunchpadFilterInput>;
  paging?: InputMaybe<PagingInput>;
};


export type QueryLeaderboardsArgs = {
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftArgs = {
  address: Scalars['String']['input'];
};


export type QueryNftEventsArgs = {
  address: Scalars['String']['input'];
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftEventsByCollectionArgs = {
  collectionAddress: Scalars['String']['input'];
  paging?: InputMaybe<PagingInput>;
};


export type QueryNftsArgs = {
  collectionAddress: Scalars['String']['input'];
  filter?: InputMaybe<NftFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<NftSortingInput>;
};


export type QueryNftsByOwnerArgs = {
  collectionAddress?: InputMaybe<Scalars['String']['input']>;
  listedFilter?: InputMaybe<NftsByOwnerListedFilter>;
  owner: Scalars['String']['input'];
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<NftSortingInput>;
};


export type QueryNotificationsArgs = {
  paging?: InputMaybe<PagingInput>;
};


export type QueryOrdersByCollectionArgs = {
  collectionAddress: Scalars['String']['input'];
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<OrderSortingInput>;
};


export type QueryRequestTwitterOAuthCodeArgs = {
  redirectUrl: Scalars['String']['input'];
};


export type QueryUserArgs = {
  address: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sorting?: InputMaybe<UserSortingInput>;
};

export type Role =
  | 'ADMIN'
  | 'USER';

export type Section = {
  __typename?: 'Section';
  content: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SectionInput = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SortingInput = {
  order?: InputMaybe<SortingOrder>;
};

export type SortingOrder =
  | 'ASC'
  | 'DES';

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']['output']>;
  subscribeCollectionOrders: OrderEvent;
  subscribeNftEvent: NftEvent;
  subscribeNotification: Notification;
};


export type SubscriptionSubscribeCollectionOrdersArgs = {
  collectionAddress: Scalars['String']['input'];
};


export type SubscriptionSubscribeNftEventArgs = {
  nftAddress: Scalars['String']['input'];
};

export type TwitterOAuthCode = {
  __typename?: 'TwitterOAuthCode';
  oauthCallbackConfirmed: Scalars['String']['output'];
  oauthToken: Scalars['String']['output'];
  oauthTokenSecret: Scalars['String']['output'];
};

export type UpdateAppConfigInput = {
  allowlist?: InputMaybe<Scalars['String']['input']>;
  allowlistPackage?: InputMaybe<Scalars['String']['input']>;
  authlistPackage?: InputMaybe<Scalars['String']['input']>;
  commissionAddress?: InputMaybe<Scalars['String']['input']>;
  commissionBps?: InputMaybe<Scalars['String']['input']>;
  dappPackage?: InputMaybe<Scalars['String']['input']>;
  dappPackages?: InputMaybe<Array<Scalars['String']['input']>>;
  explorerRpc?: InputMaybe<Scalars['String']['input']>;
  koiskPackage?: InputMaybe<Scalars['String']['input']>;
  launchpadPackage?: InputMaybe<Scalars['String']['input']>;
  launchpadV2Package?: InputMaybe<Scalars['String']['input']>;
  liquidityLayerPackage?: InputMaybe<Scalars['String']['input']>;
  liquidityLayerV1Package?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  nftProtocolPackage?: InputMaybe<Scalars['String']['input']>;
  permissionPackage?: InputMaybe<Scalars['String']['input']>;
  privateRpc?: InputMaybe<Scalars['String']['input']>;
  requestPackage?: InputMaybe<Scalars['String']['input']>;
  rpc?: InputMaybe<Scalars['String']['input']>;
  wsRpc?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCollectionInput = {
  bpsRoyaltyStrategy?: InputMaybe<Scalars['String']['input']>;
  collectionObject?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discord?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderbook?: InputMaybe<Scalars['String']['input']>;
  orderbookType?: InputMaybe<OrderbookType>;
  packageModule?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  somisOrderbook?: InputMaybe<Scalars['String']['input']>;
  transferAllowlist?: InputMaybe<Scalars['String']['input']>;
  transferPolicy?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
  withdrawPolicy?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLaunchpadInput = {
  borrowPolicy?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  collectionAddress?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discord?: InputMaybe<Scalars['String']['input']>;
  flags?: InputMaybe<Array<FlagInput>>;
  hatchDate?: InputMaybe<Scalars['DateTime']['input']>;
  hatchMetadata?: InputMaybe<Array<HatchMetadataInput>>;
  launchDate?: InputMaybe<Scalars['DateTime']['input']>;
  launchpadAddress?: InputMaybe<Scalars['String']['input']>;
  listing?: InputMaybe<Scalars['String']['input']>;
  market?: InputMaybe<Scalars['String']['input']>;
  metadataStore?: InputMaybe<Scalars['String']['input']>;
  mintPrice?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  royalty?: InputMaybe<Scalars['Int']['input']>;
  sections?: InputMaybe<Array<SectionInput>>;
  supply?: InputMaybe<Scalars['Int']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  venue?: InputMaybe<Scalars['String']['input']>;
  venues?: InputMaybe<Array<VenueInput>>;
  warehouse?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  whitelisted?: InputMaybe<Scalars['Boolean']['input']>;
  zealyApiKey?: InputMaybe<Scalars['String']['input']>;
  zealySubdomain?: InputMaybe<Scalars['String']['input']>;
  zealyXp?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateNftEventInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  newOwner?: InputMaybe<Scalars['String']['input']>;
  originOwner?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Price']['input']>;
  txId?: InputMaybe<Scalars['String']['input']>;
  type: NftEventType;
};

export type UpdateUserInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['ID']['output'];
  coverUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discordConnected?: Maybe<Scalars['Boolean']['output']>;
  discordHandle?: Maybe<Scalars['String']['output']>;
  estValue: Scalars['Float']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  listed: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownedItems: Scalars['Int']['output'];
  profileUrl?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  twitterConnected?: Maybe<Scalars['Boolean']['output']>;
  twitterHandle?: Maybe<Scalars['String']['output']>;
  unlisted: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type UserFilterInput = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
};

export type UserSortingFields =
  | 'LASTLOGIN'
  | 'NAME'
  | 'ROLE'
  | 'USERNAME';

export type UserSortingInput = {
  field?: InputMaybe<UserSortingFields>;
  order?: InputMaybe<SortingOrder>;
};

export type UsersResult = PagingResult & {
  __typename?: 'UsersResult';
  items: Array<User>;
  totalItems: Scalars['Int']['output'];
};

export type Venue = {
  __typename?: 'Venue';
  address: Scalars['String']['output'];
  isPublicSale: Scalars['Boolean']['output'];
  maxMintPerWallet: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type VenueInput = {
  address: Scalars['String']['input'];
  isPublicSale: Scalars['Boolean']['input'];
  maxMintPerWallet: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
  startTime: Scalars['DateTime']['input'];
};



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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  PagingResult: ( CollectionsResult ) | ( LaunchpadsResult ) | ( NftEventResult ) | ( NftResult ) | ( NotificationResult ) | ( OrdersResult ) | ( UsersResult );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSPresignedPost: ResolverTypeWrapper<AwsPresignedPost>;
  AdminCreateUserInput: AdminCreateUserInput;
  AdminUpdateUserInput: AdminUpdateUserInput;
  AppConfig: ResolverTypeWrapper<AppConfig>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Candlestick: ResolverTypeWrapper<Candlestick>;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionAttribute: ResolverTypeWrapper<CollectionAttribute>;
  CollectionBid: ResolverTypeWrapper<CollectionBid>;
  CollectionBidStats: ResolverTypeWrapper<CollectionBidStats>;
  CollectionBidStatsItem: ResolverTypeWrapper<CollectionBidStatsItem>;
  CollectionChartDataInput: CollectionChartDataInput;
  CollectionFilterInput: CollectionFilterInput;
  CollectionScatterChartData: ResolverTypeWrapper<CollectionScatterChartData>;
  CollectionScatterChartDataInput: CollectionScatterChartDataInput;
  CollectionSortingFields: CollectionSortingFields;
  CollectionSortingInput: CollectionSortingInput;
  CollectionStats: ResolverTypeWrapper<CollectionStats>;
  CollectionsResult: ResolverTypeWrapper<CollectionsResult>;
  CreateCollectionInput: CreateCollectionInput;
  CreateLaunchpadInput: CreateLaunchpadInput;
  CreateNftEventInput: CreateNftEventInput;
  Creator: ResolverTypeWrapper<Creator>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Flag: ResolverTypeWrapper<Flag>;
  FlagInput: FlagInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HatchMetadata: ResolverTypeWrapper<HatchMetadata>;
  HatchMetadataAttribute: ResolverTypeWrapper<HatchMetadataAttribute>;
  HatchMetadataAttributeInput: HatchMetadataAttributeInput;
  HatchMetadataInput: HatchMetadataInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntervalUnit: IntervalUnit;
  Launchpad: ResolverTypeWrapper<Launchpad>;
  LaunchpadFilterInput: LaunchpadFilterInput;
  LaunchpadsResult: ResolverTypeWrapper<LaunchpadsResult>;
  LeaderboardRecord: ResolverTypeWrapper<LeaderboardRecord>;
  LeaderboardResult: ResolverTypeWrapper<LeaderboardResult>;
  LoginChallenge: ResolverTypeWrapper<LoginChallenge>;
  Map: ResolverTypeWrapper<Scalars['Map']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Nft: ResolverTypeWrapper<Nft>;
  NftAttribute: ResolverTypeWrapper<NftAttribute>;
  NftAttributesFilter: NftAttributesFilter;
  NftEvent: ResolverTypeWrapper<NftEvent>;
  NftEventResult: ResolverTypeWrapper<NftEventResult>;
  NftEventType: NftEventType;
  NftFilterInput: NftFilterInput;
  NftResult: ResolverTypeWrapper<NftResult>;
  NftSortingFields: NftSortingFields;
  NftSortingInput: NftSortingInput;
  NftsByOwnerListedFilter: NftsByOwnerListedFilter;
  Notification: ResolverTypeWrapper<Notification>;
  NotificationMetadata: ResolverTypeWrapper<Scalars['NotificationMetadata']['output']>;
  NotificationResult: ResolverTypeWrapper<NotificationResult>;
  NotificationType: NotificationType;
  Order: ResolverTypeWrapper<Order>;
  OrderEvent: ResolverTypeWrapper<OrderEvent>;
  OrderEventType: OrderEventType;
  OrderSortingFields: OrderSortingFields;
  OrderSortingInput: OrderSortingInput;
  OrderbookType: OrderbookType;
  OrdersResult: ResolverTypeWrapper<OrdersResult>;
  OwnedCollection: ResolverTypeWrapper<OwnedCollection>;
  PagingInput: PagingInput;
  PagingResult: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['PagingResult']>;
  Price: ResolverTypeWrapper<Scalars['Price']['output']>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  Section: ResolverTypeWrapper<Section>;
  SectionInput: SectionInput;
  SortingInput: SortingInput;
  SortingOrder: SortingOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TwitterOAuthCode: ResolverTypeWrapper<TwitterOAuthCode>;
  UpdateAppConfigInput: UpdateAppConfigInput;
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateLaunchpadInput: UpdateLaunchpadInput;
  UpdateNftEventInput: UpdateNftEventInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserFilterInput: UserFilterInput;
  UserSortingFields: UserSortingFields;
  UserSortingInput: UserSortingInput;
  UsersResult: ResolverTypeWrapper<UsersResult>;
  Venue: ResolverTypeWrapper<Venue>;
  VenueInput: VenueInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSPresignedPost: AwsPresignedPost;
  AdminCreateUserInput: AdminCreateUserInput;
  AdminUpdateUserInput: AdminUpdateUserInput;
  AppConfig: AppConfig;
  Boolean: Scalars['Boolean']['output'];
  Candlestick: Candlestick;
  Collection: Collection;
  CollectionAttribute: CollectionAttribute;
  CollectionBid: CollectionBid;
  CollectionBidStats: CollectionBidStats;
  CollectionBidStatsItem: CollectionBidStatsItem;
  CollectionChartDataInput: CollectionChartDataInput;
  CollectionFilterInput: CollectionFilterInput;
  CollectionScatterChartData: CollectionScatterChartData;
  CollectionScatterChartDataInput: CollectionScatterChartDataInput;
  CollectionSortingInput: CollectionSortingInput;
  CollectionStats: CollectionStats;
  CollectionsResult: CollectionsResult;
  CreateCollectionInput: CreateCollectionInput;
  CreateLaunchpadInput: CreateLaunchpadInput;
  CreateNftEventInput: CreateNftEventInput;
  Creator: Creator;
  DateTime: Scalars['DateTime']['output'];
  Flag: Flag;
  FlagInput: FlagInput;
  Float: Scalars['Float']['output'];
  HatchMetadata: HatchMetadata;
  HatchMetadataAttribute: HatchMetadataAttribute;
  HatchMetadataAttributeInput: HatchMetadataAttributeInput;
  HatchMetadataInput: HatchMetadataInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Launchpad: Launchpad;
  LaunchpadFilterInput: LaunchpadFilterInput;
  LaunchpadsResult: LaunchpadsResult;
  LeaderboardRecord: LeaderboardRecord;
  LeaderboardResult: LeaderboardResult;
  LoginChallenge: LoginChallenge;
  Map: Scalars['Map']['output'];
  Mutation: {};
  Nft: Nft;
  NftAttribute: NftAttribute;
  NftAttributesFilter: NftAttributesFilter;
  NftEvent: NftEvent;
  NftEventResult: NftEventResult;
  NftFilterInput: NftFilterInput;
  NftResult: NftResult;
  NftSortingInput: NftSortingInput;
  Notification: Notification;
  NotificationMetadata: Scalars['NotificationMetadata']['output'];
  NotificationResult: NotificationResult;
  Order: Order;
  OrderEvent: OrderEvent;
  OrderSortingInput: OrderSortingInput;
  OrdersResult: OrdersResult;
  OwnedCollection: OwnedCollection;
  PagingInput: PagingInput;
  PagingResult: ResolversInterfaceTypes<ResolversParentTypes>['PagingResult'];
  Price: Scalars['Price']['output'];
  Query: {};
  Section: Section;
  SectionInput: SectionInput;
  SortingInput: SortingInput;
  String: Scalars['String']['output'];
  Subscription: {};
  TwitterOAuthCode: TwitterOAuthCode;
  UpdateAppConfigInput: UpdateAppConfigInput;
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateLaunchpadInput: UpdateLaunchpadInput;
  UpdateNftEventInput: UpdateNftEventInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserFilterInput: UserFilterInput;
  UserSortingInput: UserSortingInput;
  UsersResult: UsersResult;
  Venue: Venue;
  VenueInput: VenueInput;
};

export type Not_ImplementedDirectiveArgs = { };

export type Not_ImplementedDirectiveResolver<Result, Parent, ContextType = any, Args = Not_ImplementedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RoleDirectiveArgs = {
  roles: Array<Role>;
};

export type RoleDirectiveResolver<Result, Parent, ContextType = any, Args = RoleDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AwsPresignedPostResolvers<ContextType = any, ParentType = ResolversParentTypes['AWSPresignedPost']> = {
  fields?: Resolver<ResolversTypes['Map'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppConfigResolvers<ContextType = any, ParentType = ResolversParentTypes['AppConfig']> = {
  allowlist?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  allowlistPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  authlistPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commissionAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commissionBps?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dappPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dappPackages?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  explorerRpc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  koiskPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  launchpadPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  launchpadV2Package?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityLayerPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityLayerV1Package?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  network?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftProtocolPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissionPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privateRpc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestPackage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rpc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  wsRpc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CandlestickResolvers<ContextType = any, ParentType = ResolversParentTypes['Candlestick']> = {
  c?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  h?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  l?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  o?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  v?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = any, ParentType = ResolversParentTypes['Collection']> = {
  address?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attributes?: Resolver<Array<ResolversTypes['CollectionAttribute']>, ParentType, ContextType>;
  bpsRoyaltyStrategy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collectionBidStats?: Resolver<ResolversTypes['CollectionBidStats'], ParentType, ContextType>;
  collectionObject?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creators?: Resolver<Maybe<Array<Maybe<ResolversTypes['Creator']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discord?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  myCollecitonBid?: Resolver<Array<ResolversTypes['CollectionBid']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderbook?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderbookType?: Resolver<Maybe<ResolversTypes['OrderbookType']>, ParentType, ContextType>;
  packageModule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  royalty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  somisOrderbook?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['CollectionStats']>, ParentType, ContextType>;
  transferAllowlist?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transferPolicy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  whitelisted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  withdrawPolicy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionAttributeResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionAttribute']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['NftAttribute']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionBidResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionBid']> = {
  bidder?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  bidderKiosk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Price'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionBidStatsResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionBidStats']> = {
  items?: Resolver<Array<ResolversTypes['CollectionBidStatsItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionBidStatsItemResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionBidStatsItem']> = {
  numberOfBid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionScatterChartDataResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionScatterChartData']> = {
  p?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionStatsResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionStats']> = {
  floor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  listedItem?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owners?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalVol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vol7D?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vol24?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vol24Delta?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vol30D?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionsResultResolvers<ContextType = any, ParentType = ResolversParentTypes['CollectionsResult']> = {
  items?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatorResolvers<ContextType = any, ParentType = ResolversParentTypes['Creator']> = {
  share?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FlagResolvers<ContextType = any, ParentType = ResolversParentTypes['Flag']> = {
  included?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HatchMetadataResolvers<ContextType = any, ParentType = ResolversParentTypes['HatchMetadata']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['HatchMetadataAttribute']>>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HatchMetadataAttributeResolvers<ContextType = any, ParentType = ResolversParentTypes['HatchMetadataAttribute']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LaunchpadResolvers<ContextType = any, ParentType = ResolversParentTypes['Launchpad']> = {
  borrowPolicy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType>;
  collectionAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  crew3Subdomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discord?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flags?: Resolver<Maybe<Array<ResolversTypes['Flag']>>, ParentType, ContextType>;
  hatchDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  hatchMetadata?: Resolver<Maybe<Array<ResolversTypes['HatchMetadata']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  launchDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  listing?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  market?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadataStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mintPrice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  owners?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  publisher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  royalty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sections?: Resolver<Maybe<Array<ResolversTypes['Section']>>, ParentType, ContextType>;
  supply?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalSales?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  venue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  venues?: Resolver<Maybe<Array<ResolversTypes['Venue']>>, ParentType, ContextType>;
  warehouse?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  whitelisted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  zealyApiKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zealySubdomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zealyXp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LaunchpadsResultResolvers<ContextType = any, ParentType = ResolversParentTypes['LaunchpadsResult']> = {
  items?: Resolver<Array<ResolversTypes['Launchpad']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeaderboardRecordResolvers<ContextType = any, ParentType = ResolversParentTypes['LeaderboardRecord']> = {
  point?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeaderboardResultResolvers<ContextType = any, ParentType = ResolversParentTypes['LeaderboardResult']> = {
  items?: Resolver<Array<ResolversTypes['LeaderboardRecord']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginChallengeResolvers<ContextType = any, ParentType = ResolversParentTypes['LoginChallenge']> = {
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signData?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface MapScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Map'], any> {
  name: 'Map';
}

export type MutationResolvers<ContextType = any, ParentType = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  adminCreateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAdminCreateUserArgs, 'input'>>;
  adminDeleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAdminDeleteUserArgs, 'address'>>;
  adminUpdateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAdminUpdateUserArgs, 'address' | 'input'>>;
  adminUpdateUserCoverImage?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationAdminUpdateUserCoverImageArgs, 'address'>>;
  adminUpdateUserProfileImage?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationAdminUpdateUserProfileImageArgs, 'address'>>;
  completeNotification?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCompleteNotificationArgs, 'id'>>;
  connectDiscord?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConnectDiscordArgs, 'code' | 'redirectUri'>>;
  connectTwitter?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConnectTwitterArgs, 'oauthToken' | 'oauthVerifier'>>;
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  createLaunchpad?: Resolver<ResolversTypes['Launchpad'], ParentType, ContextType, RequireFields<MutationCreateLaunchpadArgs, 'input'>>;
  createNftEvent?: Resolver<ResolversTypes['NftEvent'], ParentType, ContextType, RequireFields<MutationCreateNftEventArgs, 'input' | 'nftAddress'>>;
  deleteCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'address'>>;
  deleteLaunchpad?: Resolver<ResolversTypes['Launchpad'], ParentType, ContextType, RequireFields<MutationDeleteLaunchpadArgs, 'id'>>;
  deleteNftEvent?: Resolver<ResolversTypes['NftEvent'], ParentType, ContextType, RequireFields<MutationDeleteNftEventArgs, 'id'>>;
  disconnectDiscord?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  disconnectTwitter?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  dismissAllNotification?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  dismissNotification?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDismissNotificationArgs, 'id'>>;
  getNftUploadImageUrl?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationGetNftUploadImageUrlArgs, 'address'>>;
  indexCollection?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationIndexCollectionArgs, 'address'>>;
  indexCollectionByContract?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationIndexCollectionByContractArgs, 'address'>>;
  indexNft?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationIndexNftArgs, 'address'>>;
  indexWallet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationIndexWalletArgs, 'address'>>;
  onMint?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationOnMintArgs, 'launchpadId' | 'nftAddress' | 'txId'>>;
  requestLoginChallenge?: Resolver<ResolversTypes['LoginChallenge'], ParentType, ContextType, RequireFields<MutationRequestLoginChallengeArgs, 'publicKey'>>;
  submitLoginChallenge?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSubmitLoginChallengeArgs, 'jwt' | 'signature'>>;
  updateAppConfig?: Resolver<ResolversTypes['AppConfig'], ParentType, ContextType, RequireFields<MutationUpdateAppConfigArgs, 'input'>>;
  updateCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'address' | 'input'>>;
  updateCollectionCoverUrl?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateCollectionCoverUrlArgs, 'address'>>;
  updateCollectionImageUrl?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateCollectionImageUrlArgs, 'address'>>;
  updateCollectionLogoUrl?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateCollectionLogoUrlArgs, 'address'>>;
  updateLaunchpad?: Resolver<ResolversTypes['Launchpad'], ParentType, ContextType, RequireFields<MutationUpdateLaunchpadArgs, 'id' | 'input'>>;
  updateLaunchpadCover?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateLaunchpadCoverArgs, 'id'>>;
  updateLaunchpadImage?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateLaunchpadImageArgs, 'id'>>;
  updateLaunchpadLogo?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType, RequireFields<MutationUpdateLaunchpadLogoArgs, 'id'>>;
  updateNftEvent?: Resolver<ResolversTypes['NftEvent'], ParentType, ContextType, RequireFields<MutationUpdateNftEventArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserCoverImage?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType>;
  updateUserProfileImage?: Resolver<ResolversTypes['AWSPresignedPost'], ParentType, ContextType>;
};

export type NftResolvers<ContextType = any, ParentType = ResolversParentTypes['Nft']> = {
  address?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attributes?: Resolver<Maybe<Array<ResolversTypes['NftAttribute']>>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['NftEvent']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAttributeResolvers<ContextType = any, ParentType = ResolversParentTypes['NftAttribute']> = {
  floor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  items?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastSale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  percentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftEventResolvers<ContextType = any, ParentType = ResolversParentTypes['NftEvent']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newOwner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  originOwner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  txId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NftEventType'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftEventResultResolvers<ContextType = any, ParentType = ResolversParentTypes['NftEventResult']> = {
  items?: Resolver<Array<ResolversTypes['NftEvent']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftResultResolvers<ContextType = any, ParentType = ResolversParentTypes['NftResult']> = {
  items?: Resolver<Array<ResolversTypes['Nft']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationResolvers<ContextType = any, ParentType = ResolversParentTypes['Notification']> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['NotificationMetadata']>, ParentType, ContextType>;
  readAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface NotificationMetadataScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NotificationMetadata'], any> {
  name: 'NotificationMetadata';
}

export type NotificationResultResolvers<ContextType = any, ParentType = ResolversParentTypes['NotificationResult']> = {
  items?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<ContextType = any, ParentType = ResolversParentTypes['Order']> = {
  collectionAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nft?: Resolver<ResolversTypes['Nft'], ParentType, ContextType>;
  nftAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderbook?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderbookType?: Resolver<ResolversTypes['OrderbookType'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Price'], ParentType, ContextType>;
  seller?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sellerKiosk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderEventResolvers<ContextType = any, ParentType = ResolversParentTypes['OrderEvent']> = {
  nft?: Resolver<ResolversTypes['Nft'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OrderEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrdersResultResolvers<ContextType = any, ParentType = ResolversParentTypes['OrdersResult']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OwnedCollectionResolvers<ContextType = any, ParentType = ResolversParentTypes['OwnedCollection']> = {
  collection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  ownedItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PagingResultResolvers<ContextType = any, ParentType = ResolversParentTypes['PagingResult']> = {
  __resolveType: TypeResolveFn<'CollectionsResult' | 'LaunchpadsResult' | 'NftEventResult' | 'NftResult' | 'NotificationResult' | 'OrdersResult' | 'UsersResult', ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export interface PriceScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Price'], any> {
  name: 'Price';
}

export type QueryResolvers<ContextType = any, ParentType = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, Partial<QueryCollectionArgs>>;
  collectionChartData?: Resolver<Array<ResolversTypes['Candlestick']>, ParentType, ContextType, RequireFields<QueryCollectionChartDataArgs, 'input'>>;
  collectionEvents?: Resolver<ResolversTypes['NftEventResult'], ParentType, ContextType, RequireFields<QueryCollectionEventsArgs, 'address'>>;
  collectionScatterChartData?: Resolver<Array<ResolversTypes['CollectionScatterChartData']>, ParentType, ContextType, RequireFields<QueryCollectionScatterChartDataArgs, 'input'>>;
  collections?: Resolver<ResolversTypes['CollectionsResult'], ParentType, ContextType, Partial<QueryCollectionsArgs>>;
  collectionsByOwner?: Resolver<Array<ResolversTypes['OwnedCollection']>, ParentType, ContextType, RequireFields<QueryCollectionsByOwnerArgs, 'owner'>>;
  getAppConfig?: Resolver<ResolversTypes['AppConfig'], ParentType, ContextType>;
  launchpad?: Resolver<Maybe<ResolversTypes['Launchpad']>, ParentType, ContextType, RequireFields<QueryLaunchpadArgs, 'id'>>;
  launchpads?: Resolver<ResolversTypes['LaunchpadsResult'], ParentType, ContextType, Partial<QueryLaunchpadsArgs>>;
  leaderboards?: Resolver<ResolversTypes['LeaderboardResult'], ParentType, ContextType, Partial<QueryLeaderboardsArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  nft?: Resolver<Maybe<ResolversTypes['Nft']>, ParentType, ContextType, RequireFields<QueryNftArgs, 'address'>>;
  nftEvents?: Resolver<ResolversTypes['NftEventResult'], ParentType, ContextType, RequireFields<QueryNftEventsArgs, 'address'>>;
  nftEventsByCollection?: Resolver<ResolversTypes['NftEventResult'], ParentType, ContextType, RequireFields<QueryNftEventsByCollectionArgs, 'collectionAddress'>>;
  nfts?: Resolver<ResolversTypes['NftResult'], ParentType, ContextType, RequireFields<QueryNftsArgs, 'collectionAddress'>>;
  nftsByOwner?: Resolver<ResolversTypes['NftResult'], ParentType, ContextType, RequireFields<QueryNftsByOwnerArgs, 'listedFilter' | 'owner'>>;
  notifications?: Resolver<ResolversTypes['NotificationResult'], ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  ordersByCollection?: Resolver<ResolversTypes['OrdersResult'], ParentType, ContextType, RequireFields<QueryOrdersByCollectionArgs, 'collectionAddress'>>;
  requestTwitterOAuthCode?: Resolver<ResolversTypes['TwitterOAuthCode'], ParentType, ContextType, RequireFields<QueryRequestTwitterOAuthCodeArgs, 'redirectUrl'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'address'>>;
  users?: Resolver<ResolversTypes['UsersResult'], ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type SectionResolvers<ContextType = any, ParentType = ResolversParentTypes['Section']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType = ResolversParentTypes['Subscription']> = {
  _empty?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_empty", ParentType, ContextType>;
  subscribeCollectionOrders?: SubscriptionResolver<ResolversTypes['OrderEvent'], "subscribeCollectionOrders", ParentType, ContextType, RequireFields<SubscriptionSubscribeCollectionOrdersArgs, 'collectionAddress'>>;
  subscribeNftEvent?: SubscriptionResolver<ResolversTypes['NftEvent'], "subscribeNftEvent", ParentType, ContextType, RequireFields<SubscriptionSubscribeNftEventArgs, 'nftAddress'>>;
  subscribeNotification?: SubscriptionResolver<ResolversTypes['Notification'], "subscribeNotification", ParentType, ContextType>;
};

export type TwitterOAuthCodeResolvers<ContextType = any, ParentType = ResolversParentTypes['TwitterOAuthCode']> = {
  oauthCallbackConfirmed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oauthToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oauthTokenSecret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType = ResolversParentTypes['User']> = {
  address?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  coverUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordConnected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  discordHandle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  listed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownedItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  profileUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  twitterConnected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  twitterHandle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unlisted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResultResolvers<ContextType = any, ParentType = ResolversParentTypes['UsersResult']> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VenueResolvers<ContextType = any, ParentType = ResolversParentTypes['Venue']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPublicSale?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxMintPerWallet?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSPresignedPost?: AwsPresignedPostResolvers<ContextType>;
  AppConfig?: AppConfigResolvers<ContextType>;
  Candlestick?: CandlestickResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  CollectionAttribute?: CollectionAttributeResolvers<ContextType>;
  CollectionBid?: CollectionBidResolvers<ContextType>;
  CollectionBidStats?: CollectionBidStatsResolvers<ContextType>;
  CollectionBidStatsItem?: CollectionBidStatsItemResolvers<ContextType>;
  CollectionScatterChartData?: CollectionScatterChartDataResolvers<ContextType>;
  CollectionStats?: CollectionStatsResolvers<ContextType>;
  CollectionsResult?: CollectionsResultResolvers<ContextType>;
  Creator?: CreatorResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Flag?: FlagResolvers<ContextType>;
  HatchMetadata?: HatchMetadataResolvers<ContextType>;
  HatchMetadataAttribute?: HatchMetadataAttributeResolvers<ContextType>;
  Launchpad?: LaunchpadResolvers<ContextType>;
  LaunchpadsResult?: LaunchpadsResultResolvers<ContextType>;
  LeaderboardRecord?: LeaderboardRecordResolvers<ContextType>;
  LeaderboardResult?: LeaderboardResultResolvers<ContextType>;
  LoginChallenge?: LoginChallengeResolvers<ContextType>;
  Map?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Nft?: NftResolvers<ContextType>;
  NftAttribute?: NftAttributeResolvers<ContextType>;
  NftEvent?: NftEventResolvers<ContextType>;
  NftEventResult?: NftEventResultResolvers<ContextType>;
  NftResult?: NftResultResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationMetadata?: GraphQLScalarType;
  NotificationResult?: NotificationResultResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderEvent?: OrderEventResolvers<ContextType>;
  OrdersResult?: OrdersResultResolvers<ContextType>;
  OwnedCollection?: OwnedCollectionResolvers<ContextType>;
  PagingResult?: PagingResultResolvers<ContextType>;
  Price?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Section?: SectionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TwitterOAuthCode?: TwitterOAuthCodeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
  Venue?: VenueResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  not_implemented?: Not_ImplementedDirectiveResolver<any, any, ContextType>;
  role?: RoleDirectiveResolver<any, any, ContextType>;
};
