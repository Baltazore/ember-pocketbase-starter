import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedRoute extends Route {
  @service session;
  @service currentUser;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}
