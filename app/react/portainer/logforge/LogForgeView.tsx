import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { react2angular } from '@/react-tools/react2angular';
import { Button } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { InputGroup } from '@@/form-components/InputGroup';
import { Eye, EyeOff } from 'lucide-react';
import { useField } from 'formik';
import { PageHeader } from '@@/PageHeader';
import axios from '@/portainer/services/axios';
import { useCurrentUser } from '@/react/hooks/useUser';

function LogForgeUsernameField() {
  const [{ name, onBlur, onChange, value }, { error }] = useField('username');
  return (
    <FormControl
      inputId="username-field"
      label="Username"
      required
      errors={error}
      size="vertical"
    >
      <InputGroup>
        <InputGroup.Input
          id="username-field"
          name={name}
          placeholder="e.g. jdoe"
          data-cy="user-usernameInput"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="username"
        />
      </InputGroup>
    </FormControl>
  );
}

function LogForgePasswordField() {
  const [{ name, onBlur, onChange, value }, { error }] = useField('password');
  const [show, setShow] = useState(false);

  return (
    <FormControl
      label="Password"
      required
      inputId="psw-input"
      errors={error}
      size="vertical"
    >
      <InputGroup>
        <InputGroup.Input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          id="psw-input"
          data-cy="user-passwordInput"
          required
          autoComplete="current-password"
        />
        <InputGroup.Addon>
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
            }}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </InputGroup.Addon>
      </InputGroup>
    </FormControl>
  );
}

export function LogForgeView() {
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentUser();

  async function handleLogin(values: { username: string; password: string }) {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/auth', values);
      if (!data.jwt) throw new Error('No JWT returned');
      setJwt(data.jwt);

      const res = await fetch('http://localhost:8001/api/portainer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          jwt: data.jwt,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.detail || 'Failed to store JWT in LogForge backend'
        );
      }

      window.open('http://localhost:3000', '_blank');
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-body-color)' }}
    >
      <PageHeader
        title="Log Forge"
        breadcrumbs={[{ label: 'Authenticate and connect to Log Forge' }]}
      />
      <div className="flex flex-1 items-center justify-center">
        <div
          className="rounded-lg shadow-lg p-8 w-full max-w-md"
          style={{ background: 'var(--bg-panel-body-color)' }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">
            ReAuthenticate to connect to LogForge
          </h2>
          <Formik
            initialValues={{
              username: user?.Username || '',
              password: '',
            }}
            onSubmit={handleLogin}
            enableReinitialize
          >
            <Form>
              <LogForgeUsernameField />
              <LogForgePasswordField />
              <Button
                color="primary"
                className="w-full text-lg"
                type="submit"
                disabled={loading}
                data-cy="logforge-login"
              >
                {loading ? 'Connecting...' : 'Connect to Log Forge'}
              </Button>
              {error && (
                <div className="text-red-500 mt-4 text-center">{error}</div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export const LogForgeViewAngular = react2angular(
  withUIRouter(withReactQuery(withCurrentUser(LogForgeView))),
  []
);