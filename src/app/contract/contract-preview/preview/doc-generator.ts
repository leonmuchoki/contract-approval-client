import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun,
    LevelFormat
  } from "docx";
import { Contract } from "src/app/models/contract";


  export class DocumentCreator {
    public create(contractData): Document {
       
        const document = new Document({
            numbering:{
                config:[
                  {
                    reference: 'ref1',
                    levels: [
                      {
                        level: 0,
                        format: LevelFormat.UPPER_ROMAN,
                        text: '%1',
                        start: 10,
                      }
                    ],
                  },
                  {
                    reference: 'ref2',
                    levels: [
                      {
                        level: 0,
                        format: LevelFormat.LOWER_LETTER,
                        text: '%1',
                      }
                    ],
                    
                  },
                ]
              },
          sections: [
            {
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                        text: `CONTRACT NO. ${contractData.contract_no} - ${contractData.title}`,
                        bold: true,
                        size: 25
                    })
                ],
                  heading: HeadingLevel.TITLE,
                  spacing: {
                    after: 300,
                },
                }),
                
                //this.createHeading("References"),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `THIS CONTRACT AGREEMENT is made on the ${new Date(contractData.created_at).toDateString()}.`
                        })
                    ],
                    spacing: { after: 200}
                }),
                new Paragraph({
                    text: "BETWEEN",
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${contractData.contract_entity_purchaser.entity_name},`,
                            bold: true
                        }),
                        new TextRun({
                          text: `${contractData.contract_entity_purchaser.description}  (hereinafter called “the Purchaser”), `,
                        })
                      ],
                      spacing: { after: 200 }
                }),
                new Paragraph({
                    text: "AND",
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${contractData.contract_entity_supplier.entity_name},`,
                            bold: true
                        }),
                        new TextRun({
                          text: `${contractData.contract_entity_supplier.description}  (hereinafter called “the Supplier’’).                          `,
                        })
                      ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'WHEREAS: ',
                            bold: true
                        })
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    numbering: {
                        reference: 'ref1',
                        instance: 0,
                        level: 0,
                    }
                }),
                new Paragraph({
                    text: `The Purchaser invited tenders for certain goods, viz  ${contractData.title.toLowerCase()}`,
                    numbering: {
                        reference: 'ref2',
                        instance: 0,
                        level: 0,
                    }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'NOW THIS AGREEMENT WITNESSETH AS FOLLOWS: ',
                            bold: true
                        })
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: {
                        before: 200,
                        after: 200
                    },
                }),
              ]
            }
          ]
        });
    
        return document;
      }
  }