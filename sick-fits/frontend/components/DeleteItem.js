import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = ({ children, id }) => {
  return (
    <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id }}>
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
