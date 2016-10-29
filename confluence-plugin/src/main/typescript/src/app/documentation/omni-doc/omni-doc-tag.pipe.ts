import {Pipe, PipeTransform} from '@angular/core';
import {ParamsService} from '../../params.service';
import {OmniDocService} from './shared/omnidoc.service';

@Pipe({
  name: 'omniDocTag'
})
export class OmniDocTagPipe implements PipeTransform {
  private globalPattern: RegExp = /<omni-doc ref\s*=\s*"((\\.|[^\\"])*)">([^<]+)<\/omni-doc>/g;

  public constructor(private paramsService: ParamsService, private omniDocService: OmniDocService) {
  }

  transform(value: any, args?: any): any {
    if (typeof value == 'string' && value) {
      value = value.replace(this.globalPattern, (val: string) => {
        this.globalPattern.lastIndex = 0;
        let matches = this.globalPattern.exec(val);
        let ref = matches[1];
        let content = matches[3];
        if (this.omniDocService.hasEntity(ref)) {
          return '<a href="#/' + this.paramsService.getSourceUnitId() + '/omnidoc/' + ref +
            '" class="type">' + content + '</a>';
        } else {
          return '<span class="type">' + content + '</span>';
        }
      });
    }

    return value;
  }

}
