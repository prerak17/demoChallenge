import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaPlusCircle, FaRegCalendar } from 'react-icons/fa';
import {
  Container, Row, Button
} from 'reactstrap';
import { getFlagListAsync, getDragDropListAsync, onDeleteFlagAsync, updateData } from '../../../redux/account/actions';
import './index.css';
import CreateFlag from './createFlag';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanList: [],
      jobsList: [],
      tasksList: [],
      activeCategory: '',
      dragID: '',
      dragArray: [],
      activeID: '',
      activeDataArr: [],
      addModal: false,
      editFlag: false,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { flagList } = { ...this.props };
    if (flagList !== prevProps.flagList) {
      this.setState({
        jobsList: flagList.filter((x, i) => x.type === 'job'),
        loanList: flagList.filter((x, i) => x.type === 'loan_car'),
        tasksList: flagList.filter((x, i) => x.type === 'task'),
      });
    }
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

  fetchList = () => {
    const { fetchFlagList } = { ...this.props };
    fetchFlagList({}).then((res) => {
      // if (res.payload && res.payload.length > 0) {
      // }
    }).catch((err) => {
      this.errorShow(err);
    });
  }

  modalAdd = (name = '') => {
    let { updateFormList } = { ...this.props }
    this.setState({
      addModal: !this.state.addModal,
      editFlag: false,
      activeCategory: '',
      activeID: '',
      activeDataArr: [],
    })
    let flagObj = {
      name: '',
      tag: '',
      type: name,
      categories: [],
      colour: '#ABB8C3',
      pos: 1,
      attributes: [
        { date_applicable: false },
      ],
    }
    updateFormList(flagObj);
  }

  //Categories Click Event
  onClickOfCategories = (cat) => {
    this.setState({ activeDataArr: [], activeID: '' });
    let arr = [];
    cat[1] && cat[1].length > 0 && cat[1].map((x, i) => {
      arr.push(x.id);
      this.setState({ activeDataArr: arr, activeCategory: cat[0] + x.type })
      return null;
    })
  }

  onClickOfJob = (event, job) => {
    let { updateFormList } = { ...this.props }
    this.setState({ activeID: job.id, activeDataArr: [], activeCategory: '' })

    //Update Functionality
    if (event.detail === 2) {
      updateFormList(job);
      this.setState({ addModal: !this.state.addModal, editFlag: true });
    }
  }

  //Drag & Drop Functionality
  draggableData = (ev, job) => {
    this.setState({ dragID: ev.target.id })
    let arr = [];
    arr.push({
      id: job.id,
      pos: job.pos,
    })
    this.setState({ dragArray: arr })
  }

  onDragOver = (ev, job) => {
    ev.preventDefault();
  }

  onDrop = async (ev, job, j) => {
    const { dragDropList } = { ...this.props };
    const { jobsList, loanList, tasksList, dragArray } = this.state;
    let arr = [];
    let name = '';
    if (job.type === 'job') {
      arr = jobsList;
      name = 'jobsList';
    }
    else if (job.type === 'loan_car') {
      arr = loanList;
      name = 'loanList';
    }
    else {
      arr = tasksList;
      name = 'tasksList';
    }
    if (j >= arr.length) {
      var k = j - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(j, 0, arr.splice(this.state.dragID, 1)[0]);
    this.setState({ [name]: arr });
    let apiArr = [];
    apiArr.push({
      id: job.id,
      pos: job.pos,
    })
    await this.setState({ dragArray: [...dragArray, ...apiArr] });
    let obj = {
      flags: this.state.dragArray
    }
    dragDropList(obj).then((res) => {
      if (res.payload) {
      }
    }).catch((err) => {
      this.errorShow(err);
    });
  }

  //Delete Functionality
  deleteSelectedFlag = (event, job) => {
    const { deleteFlag } = { ...this.props }
    if (event.keyCode === 46) {
      if (window.confirm(`Are you sure you want to delete ${job.name} Flag?`)) {
        deleteFlag(job).then((res) => {
          console.log(res)
          if (res.payload && res.payload.data) {
            window.toastr.success('Flag Deleted Successfully.');
            this.fetchList();
          }
        }).catch((err) => {
          if (err) {
            this.errorShow(err);
          }
        });
      } else {
        return null;
      }
    }
  }
  render() {
    const { flagList } = { ...this.props }
    const { loanList, jobsList, tasksList, activeDataArr, editFlag, activeID, activeCategory, addModal } = this.state;
    let arr = {
      jobs: {
        name: 'Jobs',
        type: 'job',
        mainArr: jobsList,
        categories: {
          Uncategorised: [],
        },
      },
      loans: {
        name: 'Loan Cars',
        type: 'loan_car',
        mainArr: loanList,
        categories: {
          Uncategorised: [],
        },
      },
      tasks: {
        name: 'Tasks',
        type: 'task',
        mainArr: tasksList,
        categories: {
          Uncategorised: [],
        },
      }
    }
    if (flagList.length > 0) {
      if (arr.jobs.mainArr.length > 0) {
        arr.jobs.mainArr.forEach((v, i) => {
          v.categories &&
            v.categories.length > 0 ?
            v.categories.forEach(cat => {
              arr.jobs.categories[cat] = arr.jobs.categories[cat] ? [...arr.jobs.categories[cat], v] : [v];
            }) :
            arr.jobs.categories['Uncategorised'].push(v);
        });
      }
      if (arr.loans.mainArr.length > 0) {
        arr.loans.mainArr.forEach((v, i) => {
          v.categories &&
            v.categories.length > 0 ?
            v.categories.forEach(cat => {
              arr.loans.categories[cat] = arr.loans.categories[cat] ? [...arr.loans.categories[cat], v] : [v];
            }) :
            arr.loans.categories['Uncategorised'].push(v);
        });
      }
      if (arr.tasks.mainArr.length > 0) {
        arr.tasks.mainArr.forEach((v, i) => {
          v.categories &&
            v.categories.length > 0 ?
            v.categories.forEach(cat => {
              arr.tasks.categories[cat] = arr.tasks.categories[cat] ? [...arr.tasks.categories[cat], v] : [v];
            }) :
            arr.tasks.categories['Uncategorised'].push(v);
        });
      }
    }

    let activeClass = (id) => {
      if (activeDataArr.length > 0 && activeDataArr.includes(id)) {
        return 'activeData';
      } else {
        return 'inactiveData'
      }
    }
    return (
      <Container fluid className="main-wrapper pt-2 pl-3">
        <h2>Flags</h2>
        <br />
        <div>
          {Object.values(arr).map((x, i) => {
            return <div key={i}>
              <div className="d-flex mt-4">
                <h5 className="heading">{x.name}</h5>
                <Button size="sm" className="ml-2 buttonBack" onClick={() => this.modalAdd(x.type)}><FaPlusCircle /> {' '}  <span>Add</span></Button>
              </div>
              {x.categories &&
                <Row className="mt-3">
                  {Object.entries(x.categories).map((category, i) => {
                    if (category[0] === 'Uncategorised' && category[1].length === 0) {
                      return <div key={i} />
                    }
                    return <div key={i} className={`pl-3 pr-2 d-flex ${activeCategory === (category[0] + x.type) ? 'activeCategory' : ''}`} onClick={() => this.onClickOfCategories(category)}>
                      <h6 className="border text-center categoriesLength">{category[1].length}</h6>
                      <h6 className="ml-2">{category[0]}</h6>
                    </div>
                  })}
                </Row>
              }
              {x.mainArr.length > 0 &&
                <Row className="ml-3 mt-3">
                  {x.mainArr.map((job, j) => {
                    return <div key={j} id={j} draggable="true"
                      className={`d-flex mainData ${activeClass(job.id)} ${job.id === activeID && 'activeJob'}`}
                      onDrop={(event) => this.onDrop(event, job, j)}
                      onDragStart={(ev) => this.draggableData(ev, job)}
                      onDragOver={(event) => this.onDragOver(event, job)}
                      onClick={(event) => this.onClickOfJob(event, job)}
                      role="textbox"
                      tabIndex={job.id}
                      onKeyUp={e => this.deleteSelectedFlag(e, job)}
                    >
                      <span className="tag" style={{ backgroundColor: `#${job.colour}` }}>
                        {job.tag}
                      </span>
                      <span className="name">
                        {job.name}
                      </span>
                      {job.attributes && (job.attributes.date_applicable === true || (job.attributes.length > 0 && job.attributes[0].date_applicable === true)) && <span>
                        <FaRegCalendar size={12} style={{
                          position: 'relative',
                          top: '-5px'
                        }} />
                      </span>}
                    </div>
                  })}
                </Row>
              }
            </div>
          })}
        </div>
        {addModal === true &&
          <CreateFlag
            isopen={addModal}
            toggle={this.modalAdd}
            fetchList={this.fetchList}
            editFlag={editFlag}
          />
        }
      </Container>
    );
  }
}

//All FlagList From Redux
const mapStateToProps = (state) => (
  {
    flagList: state.account.flagList,
    flagObject: state.account.flagObj,
  }
);

//API Calls through Redux
const mapDispatchToProps = (dispatch) => (
  {
    fetchFlagList: (data) => dispatch(getFlagListAsync(data)),
    dragDropList: (data) => dispatch(getDragDropListAsync(data)),
    updateFormList: (data) => dispatch(updateData(data)),
    deleteFlag: (data) => dispatch(onDeleteFlagAsync(data))
  }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage));
