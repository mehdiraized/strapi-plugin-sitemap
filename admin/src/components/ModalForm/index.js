import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { get, has, isEmpty } from 'lodash';

import { Inputs } from '@buffetjs/custom';
import { Button, AttributeIcon } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';
import Select from '../SelectContentTypes';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter
} from 'strapi-helper-plugin';

import form from './mapper';

const ModalForm = (props) => {
  const { search, edit } = useLocation();
  const { push } = useHistory();
  const [state, setState] = useState({});
  const isOpen = !isEmpty(search) || !isEmpty(edit);
  const globalContext = useGlobalContext();

  const {
    onSubmit,
    contentTypes,
    onChange,
    onCancel
  } = props;

  useEffect(() => {
    setState(prevState => ({ ...prevState, contentType: '' }));
  }, [])


  const handleSelectChange = (e, uidField) => {
    const contentType = e.target.value; 
    setState(prevState => ({ ...prevState, contentType }));

    // Set initial values
    onCancel();
    Object.keys(form).map(input => {
      onChange({target: form[input]}, contentType)
    });
    onChange({target: { name: 'uidField', value: uidField}}, contentType)
  }

  const getValue = (input) => {
    if (has(props.modifiedContentTypes, [contentType, input], '')) {
      return get(props.modifiedContentTypes, [contentType, input], '');
    } else {
      return form[input].value;
    }
  };

  // Styles
  const modalBodyStyle = {
    paddingTop: '0.5rem', 
    paddingBottom: '3rem'
  };

  let { contentType } = state;
  if (!isEmpty(edit)) { contentType = edit };

  return (
    <Modal
      isOpen={isOpen}
      onOpened={() => {}}
      onClosed={() => {
        onCancel();
        setState(prevState => ({ ...prevState, contentType: '' }));
      }}
      onToggle={() => push({search: ''})}
      withoverflow={'displayName'}
    >
      <HeaderModal>
        <section style={{ alignItems: 'center' }}>
          <AttributeIcon type='enum' />
          <HeaderModalTitle style={{ marginLeft: 15 }}>{globalContext.formatMessage({ id: 'sitemap.Modal.HeaderTitle' })}</HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody style={modalBodyStyle}>
        <div className="container-fluid">
        <section style={{ marginTop: 20 }}>
          <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
          { isEmpty(edit) &&
            <p style={{ maxWidth: 500 }}>{globalContext.formatMessage({ id: 'sitemap.Modal.Description' })}</p>
          }
          <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
            <div class="col-md-6">
              <Select 
                contentTypes={contentTypes} 
                onChange={(e, uidField) => handleSelectChange(e, uidField)}
                value={contentType}
                disabled={!isEmpty(edit)}
                modifiedContentTypes={props.modifiedContentTypes}
              />
            </div>
            <div class="col-md-6">
              <div className="row">
                {Object.keys(form).map(input => {
                  return (
                  <div className={form[input].styleName} key={input}>
                    <Inputs
                      name={input}
                      disabled={state.contentType === '- Choose Content Type -' || !state.contentType && isEmpty(edit)}
                      {...form[input]}
                      onChange={(e) => onChange(e, contentType)}
                      value={getValue(input)}
                    />
                  </div>
                )})}
              </div>
            </div>
          </form>
        </section>
        </div>
      </ModalBody>
      <ModalFooter>
        <section style={{ alignItems: 'center' }}>
          <Button
            color="cancel"
            onClick={() => {
              onCancel();
              setState(prevState => ({ ...prevState, contentType: '' }));
            }}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Cancel' })}
          </Button>
          <Button
            color="primary"
            style={{ marginLeft: 'auto' }}
            disabled={isEmpty(edit) && state.contentType === ''}
            onClick={(e) => {
              onSubmit(e);
              setState(prevState => ({ ...prevState, contentType: '' }));
              push({search: ''});
            }}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        </section>
      </ModalFooter>
    </Modal>
  );
}
 
export default ModalForm;