export class Contract {
    id?: number;
    contract_no?: string;
    title?: string;
    created_at?: Date;
    contract_entity_purchaser_id?: number;
    contract_entity_supplier_id?: number;
    contract_entity_purchaser?: ContractEntity;
    contract_entity_supplier?: ContractEntity;
    contract_type_id?: number;
    contract_type?: ContractType;
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