import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { TwitterPicker } from 'react-color';
import Select from 'react-select';
import {
	FormGroup, Label, Input,
	Modal, ModalBody, ModalHeader, ModalFooter, Button, Card, CustomInput
} from 'reactstrap';
import { getFlagListAsync, getCategpriesListAsync, onAddFlagAsync, onUpdateFlagAsync } from '../../../redux/account/actions';
import './index.css';

const colorValue = (flagForm) => flagForm.colour && flagForm.colour.includes('#') ? flagForm.colour : `#${flagForm.colour}`;

class CreateFlag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flagForm: props.flagObject,
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
		const { postAddFlag, postUpdatedFlag, editFlag } = { ...this.props };
		const { flagForm } = this.state;
		flagForm.colour = flagForm.colour ? flagForm.colour.replace("#", '') : '000000';
		if (editFlag === true) {
			postUpdatedFlag(flagForm).then((res) => {
				if (res.payload && res.payload.data) {
					window.toastr.success('Flag Updated Successfully.');
					this.props.toggle();
					this.props.fetchList();
				}
			}).catch((err) => {
				if (err) {
					this.errorShow(err);
				}
			});
		} else {
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
		if (err['errors']) {
			Object.values(err['errors']).map((x, i) => {
				if (typeof x[0] === 'string') {
					window.toastr.warning(x[0]);
					return null;
				}
				return null;
			})
		}
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
		const { isopen, toggle, editFlag } = this.props;
		const popover = {
			position: 'absolute',
			zIndex: '2',
			top: '40px',
		}

		return (
			<Modal isOpen={isopen} toggle={toggle}>
				<ModalHeader toggle={toggle} className="main-wrapper">{editFlag ? 'Edit Flag' : 'Add Flag'}</ModalHeader>
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
								id="loan_car"
								name="type"
								checked={flagForm.type === 'loan_car'}
								value='loan_car'
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
						<span style={{ backgroundColor: `${colorValue(flagForm)}`, borderRadius: '30px' }}
							className="col-1 ml-2 mr-2">
						</span>
						<Card className="main-card">
							<Button color="primary btn-wide btn-shadow" onClick={this.pickColour}>
								Pick Color</Button>
							{this.state.displayColorPicker ? <div style={popover}>
								<TwitterPicker
									color={colorValue(flagForm)}
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
							checked={flagForm.attributes && flagForm.attributes.length > 0 && flagForm.attributes[0].date_applicable}
							value={flagForm.attributes && flagForm.attributes.length > 0 && flagForm.attributes[0].date_applicable}
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
		postUpdatedFlag: (data) => dispatch(onUpdateFlagAsync(data)),
	}
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateFlag));
