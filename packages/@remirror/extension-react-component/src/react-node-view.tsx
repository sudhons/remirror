import React, { FunctionComponent, RefCallback } from 'react';

import {
  AnyExtension,
  Decoration,
  EditorView,
  entries,
  ErrorConstant,
  GetFixed,
  includes,
  invariant,
  isArray,
  isDomNode,
  isElementDomNode,
  isFunction,
  isPlainObject,
  isString,
  nodeEqualsType,
  NodeView,
  NodeWithAttributes,
  ProsemirrorAttributes,
  ProsemirrorNode,
  SELECTED_NODE_CLASS_NAME,
} from '@remirror/core';

import {
  CreateNodeViewParameter,
  GetPosition,
  ReactComponentOptions,
  ReactNodeViewParameter,
} from './node-view-types';
import { PortalContainer } from './portals';

export class ReactNodeView implements NodeView {
  /**
   * A shorthand method for creating the ReactNodeView
   */
  static create(parameter: CreateNodeViewParameter) {
    const { portalContainer, extension, options } = parameter;

    return (node: NodeWithAttributes, view: EditorView, getPosition: GetPosition) =>
      new ReactNodeView({
        options,
        node,
        view,
        getPosition,
        portalContainer,
        extension,
      });
  }

  /**
   * The `ProsemirrorNode` that this nodeView is responsible for rendering.
   */
  #node: NodeWithAttributes;

  /**
   * The decorations in the most recent update.
   */
  #decorations: Decoration[] = [];

  /**
   * The editor this nodeView belongs to.
   */
  #view: EditorView;

  /**
   * A container and event dispatcher which keeps track of all dom elements that
   * hold node views
   */
  readonly #portalContainer: PortalContainer;

  /**
   * The options that were passed into the extension that created this nodeView
   */
  readonly #extension: AnyExtension;

  /**
   * Method for retrieving the position of the current nodeView
   */
  readonly #getPosition: () => number;

  /**
   * The options passed through to the `ReactComponent`.
   */
  readonly #options: GetFixed<ReactComponentOptions>;

  #selected = false;

  /**
   * Whether or not the node is currently selected.
   */
  public get selected() {
    return this.#selected;
  }

  #contentDOM?: HTMLElement | undefined;

  /**
   * The DOM node that should hold the node's content. Only meaningful if the
   * node view also defines a `dom` property and if its node type is not a leaf
   * node type. When this is present, ProseMirror will take care of rendering
   * the node's children into it. When it is not present, the node view itself
   * is responsible for rendering (or deciding not to render) its child nodes.
   */
  public get contentDOM(): HTMLElement | undefined {
    return this.#contentDOM;
  }

  #dom: HTMLElement;

  /**
   * Provides readonly access to the dom element. The dom is automatically for
   * react components.
   */
  get dom() {
    return this.#dom;
  }

  /**
   * Create the node view for a react component and render it into the dom.
   */
  private constructor({
    getPosition,
    node,
    portalContainer,
    view,
    extension,
    options,
  }: ReactNodeViewParameter) {
    invariant(isFunction(getPosition), {
      message:
        'You are attempting to use a node view for a mark type. Please check your configuration.',
    });

    this.#node = node;
    this.#view = view;
    this.#portalContainer = portalContainer;
    this.#extension = extension;
    this.#getPosition = getPosition;
    this.#options = options;
    this.#dom = this.createDom();
    this.#contentDOM = this.createContentDom();

    this.setDomAttributes(this.#node, this.#dom);
    this.Component.displayName = extension.constructor.name.replace('Extension', 'NodeView');

    this.renderComponent();
  }

  /**
   * Render the react component into the dom.
   */
  private renderComponent() {
    this.#portalContainer.render({ Component: this.Component, container: this.#dom });
  }

  /**
   * Create the dom element which will hold the react component.
   */
  createDom(): HTMLElement {
    const { toDOM } = this.#node.type.spec;
    const { defaultBlockNode, defaultInlineNode } = this.#options;

    if (!toDOM) {
      return this.#node.isInline
        ? document.createElement(defaultInlineNode)
        : document.createElement(defaultBlockNode);
    }

    const domSpec = toDOM(this.#node);

    if (isString(domSpec)) {
      return document.createElement(domSpec);
    }

    if (isDomNode(domSpec)) {
      if (!isElementDomNode(domSpec)) {
        throw new Error('Invalid HTML Element provided in the DOM Spec');
      }

      return domSpec;
    }

    // Use the outer element string to render the dom node
    return document.createElement(domSpec[0]);
  }

  /**
   * The element that will contain the content for this element.
   */
  createContentDom(): HTMLElement | undefined {
    if (this.#node.isLeaf) {
      return;
    }

    const domSpec = this.#node.type.spec.toDOM?.(this.#node);

    // If no content hole included return undefined.
    if (!(isArray(domSpec) && includes(domSpec, 0))) {
      return;
    }

    const element = document.createElement(this.#options.defaultContentNode);
    element.setAttribute('contenteditable', `${this.#view.editable}`);

    return element;
  }

  /**
   * Adds a ref to the component that has been provided and can be used to set
   * it as the content container. However it is advisable to either not use
   * ReactNodeViews for nodes with content or to take control of rendering the
   * content within the component..
   */
  readonly #forwardRef: RefCallback<HTMLElement> = (node) => {
    if (!node) {
      return;
    }

    invariant(this.#contentDOM, {
      code: ErrorConstant.REACT_NODE_VIEW,
      message: `You have applied a ref to a nodeView provided by '${
        this.#extension.constructor.name
      }' which doesn't support content.`,
    });

    node.append(this.#contentDOM);
  };

  /**
   * Render the provided component.
   *
   * This method is passed into the HTML element.
   */
  private readonly Component: FunctionComponent = () => {
    const { ReactComponent } = this.#extension;

    invariant(ReactComponent, {
      code: ErrorConstant.REACT_NODE_VIEW,
      message: "The extension used to create this node view doesn't have a valid ReactComponent",
    });

    return (
      <ReactComponent
        updateAttributes={this.updateAttributes}
        selected={this.selected}
        view={this.#view}
        getPosition={this.#getPosition}
        node={this.#node}
        forwardRef={this.#forwardRef}
        options={this.#extension.options as any}
        decorations={this.#decorations}
      />
    );
  };

  /**
   * Passed to the Component to enable updating the attributes from within the component.
   */
  private readonly updateAttributes = (attrs: ProsemirrorAttributes) => {
    if (!this.#view.editable) {
      return;
    }

    const tr = this.#view.state.tr.setNodeMarkup(this.#getPosition(), undefined, {
      ...this.#node.attrs,
      ...attrs,
    });

    this.#view.dispatch(tr);
  };

  /**
   * Update the prosemirror node.
   */
  update(node: ProsemirrorNode, decorations: Decoration[]) {
    if (!nodeEqualsType({ types: this.#node.type, node })) {
      return false;
    }

    if (this.#node === node && this.#decorations === decorations) {
      return true;
    }

    if (!this.#node.sameMarkup(node)) {
      this.setDomAttributes(node, this.#dom);
    }

    this.#node = node as NodeWithAttributes;
    this.#decorations = decorations;
    this.renderComponent();

    return true;
  }

  /**
   * Copies the attributes from a ProseMirror Node to the parent DOM node.
   *
   * @param node The Prosemirror Node from which to source the attributes
   */
  setDomAttributes(node: ProsemirrorNode, element: HTMLElement) {
    const { toDOM } = this.#node.type.spec;
    let attributes = node.attrs;

    if (toDOM) {
      const domSpec = toDOM(node);

      if (isString(domSpec) || isDomNode(domSpec)) {
        return;
      }

      if (isPlainObject(domSpec[1])) {
        attributes = domSpec[1];
      }
    }

    for (const [attribute, value] of entries(attributes)) {
      element.setAttribute(attribute, value);
    }
  }

  /**
   * Marks the node as being selected.
   */
  selectNode() {
    this.#selected = true;

    if (this.#dom) {
      this.#dom.classList.add(SELECTED_NODE_CLASS_NAME);
    }

    this.renderComponent();
  }

  // Remove selected node marking from this node.
  deselectNode() {
    this.#selected = false;

    if (this.#dom) {
      this.#dom.classList.remove(SELECTED_NODE_CLASS_NAME);
    }

    this.renderComponent();
  }

  /**
   * This is called whenever the node is being destroyed.
   */
  destroy() {
    this.#portalContainer.remove(this.#dom);
  }

  ignoreMutation(mutation: IgnoreMutationParameter) {
    if (mutation.type === 'selection') {
      return false;
    }

    if (!this.contentDOM) {
      return true;
    }

    return !this.contentDOM.contains(mutation.target);
  }
}

type IgnoreMutationParameter = MutationRecord | { type: 'selection'; target: Element };