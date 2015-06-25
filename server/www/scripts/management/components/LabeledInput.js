define(["react", "libs/Emitter"], function(React, Emitter) {
	function LabeledInput() {
	};

	Emitter.mixInto(LabeledInput);

	LabeledInput.prototype.getComponent = function() {
		var self = this;
		var input = React.createClass({
			getInitialState: function() {
				return {
					value: "",
					isValid: false,
					emitter: self
				};
			},
			handleChange: function(event) {
				var value = event.target.value;
				this.state.isValid = (value !== "");
				this.state.emitter.trigger("validation-ready", value); 	
				this.setState({value: event.target.value});
			},
			render: function() {
				var input = React.createElement("input", {value: this.state.value, onChange: this.handleChange});
				return React.createElement("div", {className: "form-group validation-intput" + ((this.state.isValid) ? " has-success" : "")}, input);
			}
		});
		
		var LabeledInputComponent = React.createClass({
			render: function() {
				var label = React.createElement("span", {className: "label"}, this.props.label);
				return React.createElement("div", {className: "labeled-input"}, [label, React.createElement(input)]);
			}
		});

		return LabeledInputComponent;
	};

	return LabeledInput;

});