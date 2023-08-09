module module_name::module_name {
    use std::ascii;
    use std::option;
    use std::string::{Self, String};
    use std::vector::{Self};

    use sui::url::{Self, Url};
    use sui::kiosk::{Self, Kiosk};
    use sui::clock::{Self, Clock};
    use sui::display;
    use sui::transfer;
    use sui::package::{Self, Publisher};
    use sui::object::{Self, ID, UID};
    use sui::vec_set;
    use sui::tx_context::{Self, TxContext}; use sui::dynamic_field::{Self}; use nft_protocol::mint_event;
    use nft_protocol::mint_cap;
    use nft_protocol::creators;
    use nft_protocol::royalty;
    use nft_protocol::attributes::{Self, Attributes};
    use nft_protocol::collection;
    use nft_protocol::display_info;
    use nft_protocol::mint_cap::MintCap;
    use nft_protocol::royalty_strategy_bps;
    use nft_protocol::tags;
    use nft_protocol::symbol::{Self};

    use ob_launchpad::inventory::{Self};
    use ob_launchpad::listing::{Self, Listing};

    use ob_permissions::witness;
    use liquidity_layer_v1::orderbook::{Self};

    use ob_request::transfer_request::{Self};
    use ob_request::withdraw_request::{Self};
    use ob_request::borrow_request::{Self, BorrowRequest, BORROW_REQ};
    use ob_request::request::{Self, Policy, RequestBody, WithNft};


    use ob_kiosk::ob_kiosk::{Self};

    /// One time witness is only instantiated in the init method
    struct MODULE_NAME has drop {}

    /// Can be used for authorization of other actions post-creation. It is
    /// vital that this struct is not freely given to any contract, because it
    /// serves as an auth token.
    struct Witness has drop {}

    struct ModuleName has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        attributes: Attributes,
    }

    struct MetadataStore has key, store {
        id: UID,
        cursor: u64,
        start_time: u64,
    }

    struct Metadata has store {
        name: String,
        description: String,
        url: Url,
        attributes: Attributes,
    }

    fun init(otw: MODULE_NAME, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        // Init Collection & MintCap with unlimited supply
        let (collection, mint_cap) = collection::create_with_mint_cap<MODULE_NAME, ModuleName>(
            &otw, option::none(), ctx
        );

        // Init Publisher
        let publisher = sui::package::claim(otw, ctx);
        let dw = witness::from_witness(Witness {});

        let tags = vector[tags::art()];

        // Init Display
        let display = display::new<ModuleName>(&publisher, ctx);
        display::add(&mut display, string::utf8(b"name"), string::utf8(b"{name}"));
        display::add(&mut display, string::utf8(b"description"), string::utf8(b"{description}"));
        display::add(&mut display, string::utf8(b"image_url"), string::utf8(b"{url}"));
        display::add(&mut display, string::utf8(b"attributes"), string::utf8(b"{attributes}"));
        display::add(&mut display, string::utf8(b"tags"), ob_utils::display::from_vec(tags));
        display::update_version(&mut display);
        transfer::public_transfer(display, tx_context::sender(ctx));

        collection::add_domain(dw, &mut collection, display_info::new(
            string::utf8(b"{{ name }}"), 
            string::utf8(b"{{ description }}")
        ));

        let creators = vector[@module_creator_placeholder];
        let shares = vector[10_000];
        // Creators domain
        collection::add_domain(
            dw,
            &mut collection,
            creators::new(ob_utils::utils::vec_set_from_vec(&creators)),
        );

        let (withdraw_policy, withdraw_policy_cap) =  withdraw_request::init_policy<ModuleName>(
           &publisher, 
           ctx
        );

        let shares = ob_utils::utils::from_vec_to_map(creators, shares);
        royalty_strategy_bps::create_domain_and_add_strategy(
            dw, &mut collection, royalty::from_shares(shares, ctx), 100, ctx,
        );

        let (transfer_policy, transfer_policy_cap) = transfer_request::init_policy<ModuleName>(&publisher, ctx);
        let (borrow_policy, borrow_policy_cap) = borrow_request::init_policy<ModuleName>(&publisher, ctx);

        // Enforce Royalty
        royalty_strategy_bps::enforce(&mut transfer_policy, &transfer_policy_cap);

        let listing = listing::new(
            tx_context::sender(ctx),
            tx_context::sender(ctx),
            ctx,
        );

        let inventory_id = listing::create_warehouse<ModuleName>(
            &mut listing, ctx
        );

        // {{ add_venue_placeholder }}

        orderbook::create_unprotected<ModuleName, sui::sui::SUI>(
            dw,
            &transfer_policy, 
            ctx
        );

        // create_metadata_store(&publisher, ctx);

        transfer::public_transfer(publisher, sender);
        transfer::public_transfer(mint_cap, sender);
        transfer::public_transfer(transfer_policy_cap, sender);
        transfer::public_transfer(withdraw_policy_cap, sender);
        transfer::public_transfer(borrow_policy_cap, sender);
        transfer::public_share_object(listing);
        transfer::public_share_object(collection);
        transfer::public_share_object(transfer_policy);
        transfer::public_share_object(withdraw_policy);
        transfer::public_share_object(borrow_policy);
    }

    public entry fun mint_nft(
        name: String,
        description: String,
        url: vector<u8>,
        attribute_keys: vector<ascii::String>,
        attribute_values: vector<ascii::String>,
        mint_cap: &MintCap<ModuleName>,
        listing: &mut Listing,
        inventory_id: ID,
        ctx: &mut TxContext,
    ) {
        let nft = ModuleName {
            id: object::new(ctx),
            name,
            description,
            url: url::new_unsafe_from_bytes(url),
            attributes: attributes::from_vec(attribute_keys, attribute_values)
        };

        mint_event::emit_mint(
            witness::from_witness(Witness {}),
            mint_cap::collection_id(mint_cap),
            &nft
        );

        let inventory = listing::inventory_admin_mut<ModuleName>(listing, inventory_id, ctx);
        inventory::deposit_nft(inventory, nft);
    }

    public entry fun mint_nft_to_wallet(
        name: String,
        description: String,
        url: vector<u8>,
        attribute_keys: vector<ascii::String>,
        attribute_values: vector<ascii::String>,
        mint_cap: &MintCap<ModuleName>,
        wallet: address,
        ctx: &mut TxContext,
    ) {
        let nft = ModuleName {
            id: object::new(ctx),
            name,
            description,
            url: url::new_unsafe_from_bytes(url),
            attributes: attributes::from_vec(attribute_keys, attribute_values)
        };

        mint_event::emit_mint(
            witness::from_witness(Witness {}),
            mint_cap::collection_id(mint_cap),
            &nft
        );

        transfer::public_transfer(nft, wallet);
    }

    // Call by Collection owner
    public fun create_metadata_store(
        publisher: &Publisher,
        start_time: u64,
        ctx: &mut TxContext,
    ): MetadataStore {
        assert!(package::from_package<ModuleName>(publisher), 1);

        let metadata_store = MetadataStore {
            id: object::new(ctx),
            cursor: 0,
            start_time: start_time,
        };

        // transfer::share_object(metadata_store);

        return metadata_store
    }

    public entry fun update_metadata_store_start_time(
        publisher: &Publisher,
        metadata_store: &mut MetadataStore,
        start_time: u64,
        _ctx: &mut TxContext,
    ) {
        assert!(package::from_package<ModuleName>(publisher), 1);

        metadata_store.start_time = start_time;
    }

    // Call by Collection owner
    public entry fun insert_nft_metadata(
        publisher: &Publisher,
        metadata_store: &mut MetadataStore,
        name: String,
        description: String,
        url: vector<u8>,
        attribute_keys: vector<ascii::String>,
        attribute_values: vector<ascii::String>,
        _ctx: &mut TxContext,
    ) {
        assert!(package::from_package<ModuleName>(publisher), 1);

        let metadata = Metadata {
            name,
            description,
            url: url::new_unsafe_from_bytes(url),
            attributes: attributes::from_vec(attribute_keys, attribute_values)
        };
        
        store_metadata(metadata_store, metadata);
    }

    // Call by NFT owner
    public entry fun reveal_nft(
        kiosk: &mut Kiosk,
        nft_id: ID,
        metadata_store: &mut MetadataStore,
        policy: &Policy<WithNft<ModuleName, BORROW_REQ>>,
        clock: &Clock,
        _ctx: &mut TxContext,
    ) {

        assert!(clock::timestamp_ms(clock) > metadata_store.start_time, 0);

        let revealed = dynamic_field::exists_with_type<ID, bool>(&mut metadata_store.id, nft_id);
        assert!(!revealed, 1);

        let dw = witness::from_witness<ModuleName, Witness>(Witness {});
        let request = ob_kiosk::borrow_nft_mut<ModuleName>(kiosk, nft_id, option::none(), _ctx);
        let nft = borrow_request::borrow_nft(dw, &mut request);

        {
            let Metadata { name, description, url, attributes } = retrive_metadata(metadata_store);

            if (!string::is_empty(&name)) {
                nft.name = name;
            };
            if (!string::is_empty(&description)) {
                nft.description = description;
            };
            nft.url = url;
            nft.attributes = attributes;
        };

        borrow_request::return_nft(dw, &mut request, nft);
        ob_kiosk::return_nft<MODULE_NAME, ModuleName>(kiosk, request, policy);

        // prevent the same nft to call the function again
        dynamic_field::add<ID, bool>(&mut metadata_store.id, nft_id, true);
    }

    fun store_metadata(store: &mut MetadataStore, metadata: Metadata) {
        store.cursor = store.cursor + 1;
        dynamic_field::add<u64, Metadata>(&mut store.id, store.cursor, metadata);
    }

    fun retrive_metadata(store: &mut MetadataStore): Metadata {
        let metadata = dynamic_field::remove<u64, Metadata>(&mut store.id, store.cursor);
        store.cursor = store.cursor - 1;
        return metadata
    }
}
