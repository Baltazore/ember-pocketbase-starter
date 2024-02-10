import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service router;
  @service currentUser;

  async beforeModel() {
    await this.session.setup();
    return this._loadCurrentUser();
  }

  async _loadCurrentUser() {
    try {
      await this.currentUser.load();
    } catch (err) {
      await this.session.invalidate();
    }
  }
}
