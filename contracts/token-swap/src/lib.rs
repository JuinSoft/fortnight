#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[multiversx_sc::contract]
pub trait TokenSwap {
    #[init]
    fn init(&self) {
        self.state().set(State::Inactive);
    }

    #[endpoint]
    fn swap(
        &self,
        from_token_id: TokenIdentifier,
        from_amount: BigUint,
        to_token_id: TokenIdentifier,
    ) -> SCResult<()> {
        self.require_state_active()?;
        
        require!(from_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(to_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(from_amount > 0, "Amount must be greater than 0");
        
        let caller = self.blockchain().get_caller();
        let rate = self.get_exchange_rate(&from_token_id, &to_token_id)?;
        let to_amount = from_amount.clone() * rate / BigUint::from(1000u64);
        
        require!(
            self.blockchain().get_esdt_balance(&self.blockchain().get_sc_address(), &to_token_id, 0) >= to_amount,
            "Insufficient liquidity"
        );
        
        // Transfer tokens from caller to contract
        self.send().direct_esdt(&caller, &from_token_id, 0, &from_amount);
        
        // Transfer tokens from contract to caller
        self.send().direct_esdt(&caller, &to_token_id, 0, &to_amount);
        
        // Emit swap event
        self.swap_event(&caller, &from_token_id, &from_amount, &to_token_id, &to_amount);
        
        Ok(())
    }
    
    #[endpoint(addLiquidity)]
    fn add_liquidity(
        &self,
        token_id: TokenIdentifier,
        amount: BigUint,
    ) -> SCResult<()> {
        self.require_state_active()?;
        require!(token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(amount > 0, "Amount must be greater than 0");
        
        let caller = self.blockchain().get_caller();
        
        // Transfer tokens from caller to contract
        self.send().direct_esdt(&caller, &token_id, 0, &amount);
        
        // Update liquidity provider's share
        let mut provider_share = self.liquidity_share(&caller, &token_id).get();
        provider_share += amount.clone();
        self.liquidity_share(&caller, &token_id).set(&provider_share);
        
        // Emit liquidity added event
        self.liquidity_added_event(&caller, &token_id, &amount);
        
        Ok(())
    }
    
    #[endpoint(removeLiquidity)]
    fn remove_liquidity(
        &self,
        token_id: TokenIdentifier,
        amount: BigUint,
    ) -> SCResult<()> {
        self.require_state_active()?;
        require!(token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(amount > 0, "Amount must be greater than 0");
        
        let caller = self.blockchain().get_caller();
        let provider_share = self.liquidity_share(&caller, &token_id).get();
        
        require!(provider_share >= amount, "Insufficient liquidity share");
        
        // Update liquidity provider's share
        self.liquidity_share(&caller, &token_id).set(&(provider_share - amount.clone()));
        
        // Transfer tokens from contract to caller
        self.send().direct_esdt(&caller, &token_id, 0, &amount);
        
        // Emit liquidity removed event
        self.liquidity_removed_event(&caller, &token_id, &amount);
        
        Ok(())
    }
    
    #[endpoint(setExchangeRate)]
    fn set_exchange_rate(
        &self,
        from_token_id: TokenIdentifier,
        to_token_id: TokenIdentifier,
        rate: BigUint,
    ) -> SCResult<()> {
        self.require_caller_owner()?;
        require!(from_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(to_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(rate > 0, "Rate must be greater than 0");
        
        self.exchange_rate(&from_token_id, &to_token_id).set(&rate);
        
        Ok(())
    }
    
    #[endpoint(setState)]
    fn set_state(&self, state: State) -> SCResult<()> {
        self.require_caller_owner()?;
        self.state().set(state);
        
        Ok(())
    }
    
    // Views
    
    #[view(getExchangeRate)]
    fn get_exchange_rate(
        &self,
        from_token_id: &TokenIdentifier,
        to_token_id: &TokenIdentifier,
    ) -> SCResult<BigUint> {
        require!(from_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        require!(to_token_id.is_valid_esdt_identifier(), "Invalid ESDT token ID");
        
        let rate = self.exchange_rate(from_token_id, to_token_id).get();
        require!(rate > 0, "Exchange rate not set");
        
        Ok(rate)
    }
    
    #[view(getLiquidityShare)]
    fn get_liquidity_share(
        &self,
        address: ManagedAddress,
        token_id: &TokenIdentifier,
    ) -> BigUint {
        self.liquidity_share(&address, token_id).get()
    }
    
    #[view(getState)]
    fn get_state(&self) -> State {
        self.state().get()
    }
    
    // Private methods
    
    fn require_state_active(&self) -> SCResult<()> {
        match self.state().get() {
            State::Active => Ok(()),
            _ => sc_error!("Contract is not active"),
        }
    }
    
    fn require_caller_owner(&self) -> SCResult<()> {
        let caller = self.blockchain().get_caller();
        let owner = self.blockchain().get_owner_address();
        
        if caller == owner {
            Ok(())
        } else {
            sc_error!("Caller is not the owner")
        }
    }
    
    // Events
    
    #[event("swap")]
    fn swap_event(
        &self,
        #[indexed] caller: &ManagedAddress,
        #[indexed] from_token: &TokenIdentifier,
        from_amount: &BigUint,
        #[indexed] to_token: &TokenIdentifier,
        to_amount: &BigUint,
    );
    
    #[event("liquidityAdded")]
    fn liquidity_added_event(
        &self,
        #[indexed] provider: &ManagedAddress,
        #[indexed] token: &TokenIdentifier,
        amount: &BigUint,
    );
    
    #[event("liquidityRemoved")]
    fn liquidity_removed_event(
        &self,
        #[indexed] provider: &ManagedAddress,
        #[indexed] token: &TokenIdentifier,
        amount: &BigUint,
    );
    
    // Storage
    
    #[storage_mapper("state")]
    fn state(&self) -> SingleValueMapper<State>;
    
    #[storage_mapper("exchangeRate")]
    fn exchange_rate(
        &self,
        from_token_id: &TokenIdentifier,
        to_token_id: &TokenIdentifier,
    ) -> SingleValueMapper<BigUint>;
    
    #[storage_mapper("liquidityShare")]
    fn liquidity_share(
        &self,
        provider: &ManagedAddress,
        token_id: &TokenIdentifier,
    ) -> SingleValueMapper<BigUint>;
}

#[derive(TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum State {
    Inactive,
    Active,
    Paused,
} 