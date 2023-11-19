import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginFormComponent extends Component {
  @service router;
  @service session;

  @tracked initialForm = true;
  @tracked errorMessage = null;
  @tracked successMessage = null;

  @action
  async authenticate(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { identification, password } = Object.fromEntries(formData.entries());

    try {
      await this.session.authenticate(
        'authenticator:pocketbase',
        identification,
        password,
      );
    } catch (error) {
      console.log(error);
      this.errorMessage = error.error || error;
    }

    if (this.session.isAuthenticated) {
      // What to do with all this success?
      this.router.transitionTo('authenticated');
    }
  }
}
