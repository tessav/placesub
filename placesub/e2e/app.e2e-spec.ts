import { PlacesubPage } from './app.po';

describe('placesub App', () => {
  let page: PlacesubPage;

  beforeEach(() => {
    page = new PlacesubPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
