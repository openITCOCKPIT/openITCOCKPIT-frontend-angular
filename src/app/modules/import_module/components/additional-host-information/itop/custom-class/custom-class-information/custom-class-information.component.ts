import { Component, Input, OnInit } from '@angular/core';
import { SelectKeyValue } from '../../../../../../../layouts/primeng/select.interface';
import { GenericKeyValue } from '../../../../../../../generic.interfaces';

@Component({
    selector: 'oitc-custom-class-information',
    standalone: true,
    imports: [],
    templateUrl: './custom-class-information.component.html',
    styleUrl: './custom-class-information.component.css'
})
export class CustomClassInformationComponent implements OnInit{
    @Input() customInfo!: any;

    public dataForView: GenericKeyValue[] = [];

     public ngOnInit() :void{
         this.dataForView = this.makeAnyAnArray(this.customInfo);
         console.log(this.dataForView);
    }

    private getDataType(data:any): string {
        if(Array.isArray(data)) {
            return 'array';
        }
        if(typeof data === 'object') {
            return 'object';
        }

        // Not too important is really a string, but we can print it
        return 'string';
    }

    private makeAnyAnArray(data:any){
        let result = [];

        switch (this.getDataType(data)) {
            case 'string':
                result.push({key: '', value: data});
                break;

            case 'array':
                data.forEach((element: any) => {
                    if(this.getDataType(element) !== 'string') {
                        const subData = this.makeAnyAnArray(element);
                        subData.forEach((subElement: any) => {
                            result.push(subElement);
                        });
                    }

                    result.push({key: '', value: element});
                });
                break;

            case 'object':
                for (const [key, value] of Object.entries(data)) {
                    if(this.getDataType(value) !== 'string') {
                        const subData = this.makeAnyAnArray(value);
                        subData.forEach((subElement: any) => {
                            result.push(subElement);
                        });
                    }

                    result.push({key: key, value: value});
                }
                break;
        }

        return result;

    }

}
