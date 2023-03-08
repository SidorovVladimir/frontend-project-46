import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value) && value !== null) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return `${value}`;
};

const getFullPath = (node, currentPath) => {
  if (currentPath !== '') {
    return `${currentPath}.${node.key}`;
  }
  return `${node.key}`;
};

const iter = (diff, path) => diff.filter((node) => node.status !== 'unchanged')
  .map((node) => {
    const currentPath = getFullPath(node, path);
    switch (node.status) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${stringify(node.value)}`;
      case 'deleted':
        return `Property '${currentPath}' was removed`;
      case 'changed':
        return `Property '${currentPath}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
      case 'nested':
        return iter(node.children, currentPath).join('\n');
      default:
        return null;
    }
  });

const formatPlain = (tree) => iter(tree, '').join('\n');

export default formatPlain;
