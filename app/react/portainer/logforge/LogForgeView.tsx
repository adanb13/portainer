import React from 'react';
import { Bell } from 'lucide-react';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { react2angular } from '@/react-tools/react2angular';

export function LogForgeView() {
  return (
    <>
      <h1>
        <Bell className="inline-block mr-2" />
        LogForge
      </h1>
      <p>This is the skeleton LogForge page. Build your UI here!</p>
    </>
  );
}

// This is what you export for Angular to register
export const LogForgeViewAngular = react2angular(
  withUIRouter(withReactQuery(withCurrentUser(LogForgeView))),
  []
);
