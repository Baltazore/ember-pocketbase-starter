import Route from '@ember/routing/route';
import { query } from 'ember-pocketbase-starter/utils/pocketbase';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  model() {
    return this.store.request(
      query('posts', {}, { resourcePath: 'collections/posts/records' }),
    );
  }
}
