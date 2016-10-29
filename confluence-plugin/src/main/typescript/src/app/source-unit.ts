export class SourceUnit {

  static fromObject(obj: any): SourceUnit {
    return new SourceUnit(obj.id, obj.sourceNodeIdentifier.unitIdentifier);
  }

  constructor(public id: number, public name: String) {
  }

}
