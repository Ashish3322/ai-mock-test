import React from 'react';
import {
  Coffee,
  Layout,
  Server,
  Layers,
  Code2,
  BarChart3,
  Cpu,
  Users,
  Smartphone,
  Sparkles,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface RoleIconProps extends LucideProps {
  name?: string;
}

export const RoleIcon: React.FC<RoleIconProps> = ({ name, ...props }) => {
  const iconKey = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (iconKey) {
    case 'coffee':
    case 'java':
    case 'javadeveloper':
      return <Coffee {...props} />;
    case 'layout':
    case 'frontend':
    case 'frontenddeveloper':
      return <Layout {...props} />;
    case 'server':
    case 'backend':
    case 'backenddeveloper':
      return <Server {...props} />;
    case 'layers':
    case 'fullstack':
    case 'fullstackdeveloper':
      return <Layers {...props} />;
    case 'code':
    case 'python':
    case 'pythondeveloper':
      return <Code2 {...props} />;
    case 'barchart':
    case 'barchart3':
    case 'dataanalyst':
      return <BarChart3 {...props} />;
    case 'cpu':
    case 'softwareengineer':
      return <Cpu {...props} />;
    case 'users':
    case 'hr':
    case 'hrbehavioral':
    case 'behavioral':
      return <Users {...props} />;
    case 'smartphone':
    case 'flutter':
    case 'flutterdeveloper':
      return <Smartphone {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};
