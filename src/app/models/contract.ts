import { Product } from "./product";

export class Contract {
    id?: number;
    contract_no?: string;
    title?: string;
    created_at?: string;
    contract_entity_purchaser_id?: number;
    contract_entity_supplier_id?: number;
    contract_entity_purchaser?: ContractEntity;
    contract_entity_supplier?: ContractEntity;
    contract_type_id?: number;
    contract_type?: ContractType;
    contract_stage_id?: number;
    contract_stage?: ContractStage;
    contract_status_id?: number;
    contract_status?: ContractStatus
    contract_products?: ContractProduct[];
  }

  export class ContractProduct {
      id?: number;
      product_id?: number;
      product_quantity?: number;
      products?: Product;
  }

  export class ContractEntity {
      id?: number;
      entity_name?: string;
      description?: string;
      created_at?: string;
  }

  export class ContractType {
      id: number;
      name: string;
  }

  export class ContractStage {
      id?: number;
      contract_stage?: string;
  }

  export class ContractStatus {
    id?: number;
    status?: string;
}

  export class ContractClause {
      id?: number;
      contract_id?: number;
      clause_title?: string;
      clause_body?: string;
  }