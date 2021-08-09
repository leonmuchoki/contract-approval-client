export class Contract {
    id?: number;
    contract_no?: string;
    title?: string;
    created_at?: Date;
    contract_entity_purchaser?: ContractEntity;
    contract_entity_supplier?: ContractEntity;
  }

  export class ContractEntity {
      id?: number;
      entity_name?: string;
      description?: string;
      created_at?: string;
  }