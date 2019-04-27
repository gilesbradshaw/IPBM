import React from 'react';

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import BpmnModeler from 'bpmn-js/lib/Modeler';

export default class ReactBpmn extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.containerRef = React.createRef();
  }

  componentDidMount() {

    const {
      url,
      model,
    } = this.props;

    const container = this.containerRef.current;

    this.bpmnViewer = new BpmnModeler({ container });

    this.bpmnViewer.on('import.done', (event) => {
      const {
        error,
        warnings
      } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnViewer.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });
    if (url) {
      return this.fetchDiagram(url);
    }
    return this.updateModel(model);
  }

  componentWillUnmount() {
    this.bpmnViewer.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state
    } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }
    if (props.model !== prevProps.model) {
      return this.update(props.model);
    }

    if (state.diagramXML !== prevState.diagramXML) {
      return this.bpmnViewer.importXML(state.diagramXML);
    }
  }

  fetchDiagram(url) {

    this.handleLoading();

    fetch(url)
      .then(response => response.text())
      .then(text => this.setState({ diagramXML: text }))
      .catch(err => this.handleError(err));
  }
  updateModel(model) {

    this.handleLoading();
    try {
      this.setState({ diagramXML: model })
    } catch (err) {
      this.handleError(err)
    }
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }

  render() {
    return (
      <div className="react-bpmn-diagram-container" ref={ this.containerRef }></div>
    );
  }
}