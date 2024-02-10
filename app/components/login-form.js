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
    } catch (errorOrResponse) {
      if (typeof errorOrResponse === 'object') {
        const errorPayload = await errorOrResponse.json();
        this._setErrorMessage(errorPayload);
      } else {
        console.error('Error authenticating:', errorOrResponse);
        this.errorMessage = 'Unknown error';
      }
    }

    if (this.session.isAuthenticated) {
      // What to do with all this success?
      this.router.transitionTo('authenticated');
    }
  }

  _setErrorMessage(errorPayload) {
    const errorCodesMap = {
      400: 'Invalid email or password',
      401: 'Invalid email or password',
      500: 'Server error',
    };

    this.errorMessage = errorCodesMap[errorPayload.code] || 'Unknown error';
  }
}
