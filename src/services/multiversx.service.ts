import { Address, AddressValue, ContractFunction, SmartContract, TokenIdentifierValue, U64Value } from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { multiversxConfig } from '@/config/multiversx';

export class MultiversXService {
  private provider: ProxyNetworkProvider;

  constructor() {
    this.provider = new ProxyNetworkProvider(multiversxConfig.gatewayUrl);
  }

  /**
   * Get network configuration
   */
  public getNetworkConfig = async () => {
    return await this.provider.getNetworkConfig();
  };

  /**
   * Get account details
   * @param address - The address to get details for
   */
  public getAccount = async (address: string) => {
    return await this.provider.getAccount(new Address(address));
  };

  /**
   * Get token details
   * @param tokenId - The token identifier
   */
  public getTokenDetails = async (tokenId: string) => {
    return await this.provider.getDefinitionOfFungibleToken(tokenId);
  };

  /**
   * Get token balance
   * @param address - The address to get balance for
   * @param tokenId - The token identifier
   */
  public getTokenBalance = async (address: string, tokenId: string) => {
    return await this.provider.getFungibleTokenOfAccount(new Address(address), tokenId);
  };

  /**
   * Query a smart contract
   * @param contractAddress - The contract address
   * @param functionName - The function name to query
   * @param args - The arguments to pass to the function
   */
  public queryContract = async (contractAddress: string, functionName: string, args: any[] = []) => {
    const contract = new SmartContract({ address: new Address(contractAddress) });
    const query = contract.createQuery({
      func: new ContractFunction(functionName),
      args: args,
    });
    
    const queryResponse = await this.provider.queryContract(query);
    return queryResponse;
  };

  /**
   * Get exchange rate between two tokens
   * @param contractAddress - The contract address
   * @param fromTokenId - The source token identifier
   * @param toTokenId - The destination token identifier
   */
  public getExchangeRate = async (contractAddress: string, fromTokenId: string, toTokenId: string) => {
    const contract = new SmartContract({ address: new Address(contractAddress) });
    const query = contract.createQuery({
      func: new ContractFunction('getExchangeRate'),
      args: [
        new TokenIdentifierValue(fromTokenId),
        new TokenIdentifierValue(toTokenId),
      ],
    });
    
    const queryResponse = await this.provider.queryContract(query);
    return queryResponse;
  };

  /**
   * Get liquidity share for an address
   * @param contractAddress - The contract address
   * @param address - The address to get liquidity for
   * @param tokenId - The token identifier
   */
  public getLiquidityShare = async (contractAddress: string, address: string, tokenId: string) => {
    const contract = new SmartContract({ address: new Address(contractAddress) });
    const query = contract.createQuery({
      func: new ContractFunction('getLiquidityShare'),
      args: [
        new AddressValue(new Address(address)),
        new TokenIdentifierValue(tokenId),
      ],
    });
    
    const queryResponse = await this.provider.queryContract(query);
    return queryResponse;
  };
} 