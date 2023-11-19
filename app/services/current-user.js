import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { findRecord } from 'ember-pocketbase-starter/utils/pocketbase';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  @tracked user = null;

  async load() {
    let userId = this.session.data.authenticated.record.id;
    if (userId) {
      try {
        const userResponse = await this.store.request(
          findRecord('user', userId),
        );
        this.user = userResponse.content.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
