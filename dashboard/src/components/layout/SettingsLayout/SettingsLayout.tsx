import DepricationNotice from '@/components/common/DepricationNotice/DepricationNotice';
import type { ProjectLayoutProps } from '@/components/layout/ProjectLayout';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import type { SettingsSidebarProps } from '@/components/layout/SettingsSidebar';
import { SettingsSidebar } from '@/components/layout/SettingsSidebar';
import { RetryableErrorBoundary } from '@/components/presentational/RetryableErrorBoundary';
import { Alert } from '@/components/ui/v2/Alert';
import { Box } from '@/components/ui/v2/Box';
import { Text } from '@/components/ui/v2/Text';
import { useCurrentWorkspaceAndProject } from '@/features/projects/common/hooks/useCurrentWorkspaceAndProject';
import { useTheme } from '@mui/material';
import { twMerge } from 'tailwind-merge';

export interface SettingsLayoutProps extends ProjectLayoutProps {
  /**
   * Props passed to the sidebar component.
   */
  sidebarProps?: SettingsSidebarProps;
}

export default function SettingsLayout({
  children,
  mainContainerProps: {
    className: mainContainerClassName,
    ...mainContainerProps
  } = {},
  sidebarProps: { className: sidebarClassName, ...sidebarProps } = {},
  ...props
}: SettingsLayoutProps) {
  const theme = useTheme();
  const { currentProject } = useCurrentWorkspaceAndProject();
  const hasGitRepo = !!currentProject?.githubRepository;

  return (
    <ProjectLayout
      mainContainerProps={{
        className: twMerge('flex h-full', mainContainerClassName),
        ...mainContainerProps,
      }}
      {...props}
    >
      <SettingsSidebar
        className={twMerge('w-full max-w-sidebar', sidebarClassName)}
        {...sidebarProps}
      />

      <Box
        sx={{ backgroundColor: 'background.default' }}
        className="flex w-full flex-auto flex-col overflow-scroll overflow-x-hidden"
      >
        <RetryableErrorBoundary>
          <div className="flex flex-col space-y-2">
            <DepricationNotice />
            {hasGitRepo && (
              <Alert
                severity="warning"
                className="grid grid-flow-row place-content-center gap-2"
              >
                <Text color="warning" className="text-sm ">
                  As you have a connected repository, make sure to synchronize
                  your changes with{' '}
                  <code
                    className={twMerge(
                      'rounded-md px-2 py-px',
                      theme.palette.mode === 'dark'
                        ? 'bg-brown text-copper'
                        : 'bg-slate-200 text-slate-700',
                    )}
                  >
                    nhost config pull
                  </code>{' '}
                  or they may be reverted with the next push.
                  <br />
                  If there are multiple projects linked to the same repository
                  and you only want these changes to apply to a subset of them,
                  please check out{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    href="https://docs.nhost.io/cli/overlays"
                  >
                    docs.nhost.io/cli/overlays
                  </a>{' '}
                  for guidance.
                </Text>
              </Alert>
            )}
          </div>
          {children}
        </RetryableErrorBoundary>
      </Box>
    </ProjectLayout>
  );
}
