import { Component, OnInit } from '@angular/core';
import { map, first } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Contract } from 'src/app/models/contract';
import { ContractService } from 'src/app/services/contract.service';
import { ContractStages } from 'src/app/_helpers/contract_stages';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{
  contracts: Contract[];
  allContracts: number = 0;
  procurementContracts: number = 0;
  legalContracts: number = 0;
  ceoContracts: number = 0;
  supplierContracts: number = 0;

  cards: any;
  contractData = [];

  view: any[] = [1200, 400];
  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  contractStatus = [
    {
      name: 'Approved',
      value: 4
    },
    {
      name: 'Rejected',
      value: 2
    }
  ];

  /*BAR CHART*/
  viewBarChart: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegendBarchart = true;
  showXAxisLabel = true;
  xAxisLabel = 'Contract Status';
  showYAxisLabel = true;
  yAxisLabel = 'Count';

  colorSchemeBarChart = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  /** Based on the screen size, switch from standard to one column per row */
  cards2 = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Contracts', cols: 1, rows: 1, data: { text: this.allContracts, otherText: this.allContracts} },
        { title: 'Approved', cols: 1, rows: 1, data: { text: 'Approved contracts', otherText: 5} },
        { title: 'Rejected', cols: 1, rows: 1, data: { text: 'Rejected contracts', otherText: 5} },
        { title: 'In Progress', cols: 1, rows: 1, data: { text: 'Contracts in progress', otherText: 5} },
        { title: 'Procurement Stage', cols: 1, rows: 1, data: { text: 'Awaiting Procurement', otherText: 5} },
        { title: 'Legal Stage', cols: 1, rows: 2, data: { text: 'Awaiting Legal', otherText: 3} },
        { title: 'CEO Stage', cols: 1, rows: 1, data: { text: 'Awaiting CEO', otherText: 30} }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private contractService: ContractService 
    ) {}

  ngOnInit() {
    this.contractService.getAllContracts().pipe(first()).subscribe(contracts => {
      //console.log('landing-page::contracts::' + contracts.length);
      this.allContracts = contracts.length;
      this.procurementContracts = contracts.filter(x => x.contract_stage.id == ContractStages.procurement).length || 0;
      this.legalContracts = contracts.filter(x => x.contract_stage.id == ContractStages.legal).length || 0;
      this.ceoContracts = contracts.filter(x => x.contract_stage.id == ContractStages.ceo).length;
      this.supplierContracts = contracts.filter(x => x.contract_stage.id == ContractStages.supplier).length;
      //this.contractData.push({name:'contracts', value: this.allContracts});
      this.contractData.push({name: 'procurement stage', value: this.procurementContracts});
      this.contractData.push({name: 'legal stage', value: this.legalContracts});
      this.contractData.push({name: 'ceo stage', value: this.ceoContracts});
      this.contractData.push({name: 'supplier stage', value: this.supplierContracts});
      console.log('landing-page::contracts 2::' + this.contractData);
      this.populateCards(contracts);
      this.contracts = contracts.map((c) => {
        return {
          id: c?.id,
          contract_no: c?.contract_no,
          title: c?.title,
          purchaser: c?.contract_entity_purchaser?.entity_name,
          supplier: c?.contract_entity_supplier?.entity_name,
          created_at: new Date(c?.created_at).toLocaleDateString(),
          contract_stage: c?.contract_stage,
          contract_products: c?.contract_products
        }
      });
      //console.log('contracts::' + JSON.stringify(this.contracts));
    });
    
    
  }

  populateCards(contracts: Contract[]): void {
    //console.log('populate cards: ' + JSON.stringify(contracts));
    let contractsInProcurement = contracts && contracts.filter((x) => x?.contract_stage?.id == ContractStages.procurement).length;
    let contractsInLegal = contracts && contracts.filter((x) => x?.contract_stage?.id == ContractStages.legal).length;
    let contractsInCeoStage = contracts && contracts.filter((x) => x?.contract_stage?.id == ContractStages.ceo).length;
    let contractsInProgress = contracts && contracts.filter((x) => x?.contract_stage?.id !== ContractStages.supplier).length;

    this.cards = [
      { title: 'Contracts', cols: 1, rows: 1, data: { text: 'Available Contracts', otherText: this.allContracts} },
      { title: 'Approved', cols: 1, rows: 1, data: { text: 'Approved contracts', otherText: 0} },
      { title: 'Rejected', cols: 1, rows: 1, data: { text: 'Rejected contracts', otherText: 0} },
      { title: 'In Progress', cols: 1, rows: 1, data: { text: 'Contracts in progress', otherText: contractsInProgress} },
      { title: 'Procurement Stage', cols: 1, rows: 1, data: { text: 'Awaiting Procurement', otherText: contractsInProcurement} },
      { title: 'Legal Stage', cols: 1, rows: 2, data: { text: 'Awaiting Legal', otherText: contractsInLegal} },
      { title: 'CEO Stage', cols: 1, rows: 1, data: { text: 'Awaiting CEO', otherText: contractsInCeoStage} }
    ];
    console.log('cards:: ' + JSON.stringify(this.cards));
  }
}
