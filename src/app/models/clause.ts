import { ContractType } from "./contract";

export class Clause {
    id?: number;
    contract_type_id?: number;
    clause_title?: string;
    created_at?: Date;
    clause_details?: ClauseDetails;
    contract_types?: ContractType;
}

export class ClauseParts {
    id?: number;
    clause_part?: string;
    clause_part_name?: string;
    created_at?: Date;
}

export class ClauseDetails {
    id: number;
    clause_id?: number;
    clause_part_id?: number;
    clause_detail?: string;
    created_at?: Date;
    created_by?: number;
    clause_sub_details?: ClauseSubDetails;
}

export class ClauseSubDetails {
    id: number;
    clause_details_id?: number;
    clause_sub_detail?: string;
    created_at?: Date;
    created_by?: number;
}