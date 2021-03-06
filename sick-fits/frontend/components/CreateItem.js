import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from '../components/ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool Shoes',
    description: 'I love those shoes',
    image: '',
    largeImage: '',
    price: 1000,
  };

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async (e) => {
    console.log('uploading file...');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfit');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dwkgq1cl5/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );
    const file = await res.json();

    if (file.secure_url) {
      this.setState({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url,
      });
    }
    console.log(file, this.state);
  };

  render() {
    const isReady = this.state.image && this.state.largeImage;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error, data }) => {
          return (
            <Form
              onSubmit={async (e) => {
                //stop the form from submitting
                e.preventDefault();
                //check if image has been uploaded
                //call the utation
                const res = await createItem();
                //change to singel item page
                Router.push({
                  pathname: '/items',
                  query: { id: res.data.createItem.id },
                });
              }}
            >
              {
                <>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor='file'>
                      Upload an image
                      <input
                        type='file'
                        id='file'
                        name='file'
                        placeholder='Upload an image'
                        required
                        onChange={this.uploadFile}
                      />
                      {this.state.image && (
                        <img
                          width='200'
                          src={this.state.image}
                          alt='Upload Preview'
                        />
                      )}
                    </label>
                    <label htmlFor='title'>
                      Title
                      <input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='Title'
                        required
                        onChange={this.handleChange}
                        value={this.state.title}
                      />
                    </label>
                    <label htmlFor='price'>
                      Price
                      <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Price'
                        required
                        onChange={this.handleChange}
                        value={this.state.price}
                      />
                    </label>
                    <label htmlFor='description'>
                      Description
                      <textarea
                        id='description'
                        name='description'
                        placeholder='Enter a description'
                        required
                        onChange={this.handleChange}
                        value={this.state.description}
                      />
                    </label>

                    <button type='submit' disabled={!isReady}>
                      Submit
                    </button>
                  </fieldset>
                </>
              }
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
