import React from 'react';
import { Mutation } from 'react-apollo';
import { ALL_ITEMS_QUERY } from './Items';
import gql from 'graphql-tag';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const update = (cache, payload) => {
  //manually update the cache on the client, so it matches the server
  //1. REad the cache for the items we want
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
  console.log(data);
  //2. Filter the deleted item out of the page
  data.items = data.items.filter(
    item => item.id !== payload.data.deleteItem.id
  );
  //3.put the items back
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
};

const DeleteItem = ({ children, id }) => {
  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id }}
      update={update}
    >
      {(deleteItem, { error }) => (
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this item?')) {
              deleteItem();
            }
          }}
        >
          {children}
        </button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
