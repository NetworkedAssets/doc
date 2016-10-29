import { TypescriptPage } from './app.po';

describe('typescript App', function() {
  let page: TypescriptPage;

  beforeEach(() => {
    page = new TypescriptPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
