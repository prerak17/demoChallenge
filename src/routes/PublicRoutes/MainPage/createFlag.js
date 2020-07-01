import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { TwitterPicker } from 'react-color';
import Select from 'react-select';
import {
	FormGroup, Label, Input,
	Modal, ModalBody, ModalHeader, ModalFooter, Button, Card, CustomInput
} from 'reactstrap';
import { getFlagListAsync, getCategpriesListAsync, onAddFlagAsync } from '../../../redux/account/actions';
import './index.css';


class CreateFlag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flagForm: {
				name: '',
				tag: '',
				type: props.type,
				categories: [],
				colour: '#ABB8C3',
				pos: 1,
				attributes: [
					{ date_applicable: false },
				],
			},
			categoriesOptions: [],
			displayColorPicker: false,
		};
	}

	componentDidMount() {
		this.loadOptions();
	}

	onCheckboxChange = (ev) => {
		let arr = [
			{ date_applicable: ev.target.checked }
		]
		this.setState({
			flagForm: {
				...this.state.flagForm,
				attributes: arr
			}
		})
	}

	onFieldChange = (ev) => {
		this.setState({
			flagForm: {
				...this.state.flagForm,
				[ev.target.name]: ev.target.value
			}
		});
	};

	//Save Event
	modalSubmit = () => {
		const { postAddFlag } = { ...this.props };
		const { flagForm } = this.state;
		flagForm.colour = flagForm.colour.replace("#", '');
		postAddFlag(flagForm).then((res) => {
			if (res.payload && res.payload.data) {
				window.toastr.success('Flag Added Successfully.');
				this.props.toggle();
				this.props.fetchList();
			}
		}).catch((err) => {
			if (err) {
				this.errorShow(err);
			}
		});
	}

	//categories from API
	loadOptions = () => {
		const { fetchCategoriesList } = { ...this.props };
		fetchCategoriesList({}).then((res) => {
			if (res.payload && res.payload.length > 0) {
				let arr = [];
				res.payload.map((x, i) =>
					arr.push({ label: x, value: x })
				)
				this.setState({
					categoriesOptions: arr,
				});
			}
		}).catch((err) => {
			if (err) {
				this.errorShow(err);
			}
		});
	}

	//error common function
	errorShow = (err) => {
		Object.values(err['errors']).map((x, i) => {
			if (typeof x[0] === 'string') {
				window.toastr.warning(x[0]);
				return null;
			}
			return null;
		})
	}

	//colour picker functionality
	pickColour = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	};

	colourChange = (color) => {
		this.setState({
			flagForm: {
				...this.state.flagForm,
				'colour': color.hex
			},
			displayColorPicker: false,
		})
	}

	//radioButton
	radioHandler = ev => {
		this.setState({
			flagForm: {
				...this.state.flagForm,
				type: ev.target.value,
			}
		});
	}

	//SelectOptions
	handleOptionsChange = selectedOption => {
		let arr = [];
		if (selectedOption && selectedOption.length > 0) {
			selectedOption.map((x, i) => arr.push(x.value))
		}
		this.setState({
			flagForm: {
				...this.state.flagForm,
				categories: arr,
			}
		});
	};

	render() {
		const { categoriesOptions, flagForm } = this.state;
		const { isopen, toggle } = this.props;
		const popover = {
			position: 'absolute',
			zIndex: '2',
			top: '40px',
		}
		return (
			<Modal isOpen={isopen} toggle={toggle}>
				<ModalHeader toggle={toggle} className="main-wrapper">Add Flag</ModalHeader>
				<ModalBody>
					<div className="d-flex">
						<div className="ml-3">
							<CustomInput
								className="radioButton"
								type='radio'
								id="job"
								name="type"
								checked={flagForm.type === 'job'}
								value='job'
								onChange={this.radioHandler}
								label='Job'
							/>
						</div>
						<div className="ml-3">
							<CustomInput
								type='radio'
								className="radioButton"
								id="loan"
								name="type"
								checked={flagForm.type === 'loan'}
								value='loan'
								onChange={this.radioHandler}
								label='Loan Cars'
							/>
						</div>
						<div className="ml-3">
							<CustomInput
								className="radioButton"
								type='radio'
								id="task"
								name="type"
								checked={flagForm.type === 'task'}
								value='task'
								onChange={this.radioHandler}
								label='Tasks'
							/>
						</div>
					</div>
					<FormGroup className="d-flex">
						<Label for='name' className="col-5 mt-2">Flag Name</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder="Flag Name"
							value={flagForm.name}
							onChange={this.onFieldChange}
						/>
					</FormGroup>
					<FormGroup className="d-flex">
						<Label for='tag' className="col-5 mt-2">Short Tag</Label>
						<Input
							type="text"
							id="tag"
							name="tag"
							className="col-3"
							placeholder="Tag"
							value={flagForm.tag}
							onChange={this.onFieldChange}
							maxLength={3}
						/>
						<span style={{ backgroundColor: `${flagForm.colour}`, borderRadius: '30px' }}
							className="col-1 ml-2 mr-2">
						</span>
						<Card className="main-card">
							<Button color="primary btn-wide btn-shadow" onClick={this.pickColour}>
								Pick Color</Button>
							{this.state.displayColorPicker ? <div style={popover}>
								<TwitterPicker
									color={flagForm.colour}
									onChange={this.colourChange} />
							</div> : null}
						</Card>
					</FormGroup>
					<FormGroup className="d-flex">
						<Label for='name' className="col-5 mt-2">Attributes</Label>
						<CustomInput
							type='checkbox'
							id="date_applicable"
							name="date_applicable"
							className="col-5 mt-2"
							checked={flagForm.attributes[0].date_applicable}
							value={flagForm.attributes[0].date_applicable}
							onChange={this.onCheckboxChange}
							label='Date Applicable'
						/>
					</FormGroup>
					<FormGroup className="d-flex">
						<Label for='name' className="col-5 mt-2">Categories</Label>
						<Select
							isMulti
							name="categories"
							options={categoriesOptions}
							className="col-7 mt-2 pl-0"
							onChange={this.handleOptionsChange}
							style={{ marginLeft: '-5px' }}
						/>
					</FormGroup>
				</ModalBody>
				<ModalFooter className="main-wrapper">
					<Button color="secondary" onClick={toggle}>Cancel</Button>{' '}
					<Button color="primary" onClick={this.modalSubmit}>Save</Button>{' '}
				</ModalFooter>
			</Modal>
		);
	}
}

//FlagObject From Redux
const mapStateToProps = (state) => (
	{
		flagObject: state.account.flagObj,
	}
);

//API Calls through Redux
const mapDispatchToProps = (dispatch) => (
	{
		fetchFlagList: (data) => dispatch(getFlagListAsync(data)),
		fetchCategoriesList: (data) => dispatch(getCategpriesListAsync(data)),
		postAddFlag: (data) => dispatch(onAddFlagAsync(data)),
	}
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateFlag));
