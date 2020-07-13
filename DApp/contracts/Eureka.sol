pragma solidity ^0.5.16;

import "./SafeMath.sol";
import "./Address.sol";
import "./IERC20.sol";
import "./Context.sol";


//nobody can be a zero address

contract Eureka is Context, IERC20{
    using SafeMath for uint256;
    using Address for address;

    constructor() public {

        // _name = "Eureka Tokens";
        // _symbol = "EKA20";
        // _decimals = 18;
    }

	struct Author{
		uint256 authid; //unsigned integer
		string authname;
	}
	struct Editor{
		uint256 editid;
		string editname;
	}
	struct Paper{
        uint256 paperid;
		uint256 authid;
		string url;
		uint256 reviewCount;
        uint256 noreferencedauthors;
	}
    struct Reviewer{
        uint256 reviewerid;
        string reviewername;
        bool reviewed;
    }



    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
	mapping (address => Author) public authors;
    address[] public authorAccts;
	mapping (address => Editor) public editors;
    address[] public editorAccts;
	mapping (address => Reviewer) public reviewers; //lookup to see whos reviewed
    address[] public reviewerAccts;
	mapping (uint => Paper) public papers;

	uint256 public authorsCount;
	uint256 public editorsCount;
    uint256 public reviewersCount;
	uint256 public papersCount;
    uint256 public id;
    address[] public referencedAuthors;
    uint256 public minPaperAmount=3;
    uint256 public EditorAmt=2;
    uint256 public ReviewerAmt=1;
    uint256 public ReferencedAmt=1;
    uint256 public minreview = 1;
    uint256 private _totalSupply;
    uint8 private _decimals=18;
    string private _name="EKA Tokens";
    string private _symbol="ERC20";


	function addAuthor(address _address, string memory _nme) private { 
        authors[_address].authid = authorsCount++;
        authors[_address].authname = _nme;
        authorAccts.push(_address)-1;
    }

    function getAuthors() view public returns(address[] memory){
        return authorAccts;
    }
    function getAuthor(address _address) view public returns (uint256, string memory) {
        return (authors[_address].authid, authors[_address].authname);
    }

    function addEditor (address _address, string memory _nme) private {
        editors[_address].editid = editorsCount++;
        editors[_address].editname = _nme;
        editorAccts.push(_address)-1;
    }
    function getEditors () view public returns(address[] memory){
        return editorAccts;
    }
    function getEditor (address _address) view public returns(uint256, string memory) {
        return (editors[_address].editid, editors[_address].editname);
    }
    
    function addReviewer (address _address, string memory _nme)private {
        reviewers[_address].reviewerid=reviewersCount++;
        reviewers[_address].reviewername = _nme;
        reviewers[_address].reviewed = false;   
        reviewerAccts.push(_address)-1;
    }
    function getReviewers () view public returns(address[] memory){
        return reviewerAccts;
    }
    function getReviewer (address _address) view public returns(uint256, string memory) {
        return (reviewers[_address].reviewerid, reviewers[_address].reviewername);
    }
    

    function addPaper (uint256 _authid, address _authaddr, string memory _url, uint256 _noreferencedauth) private {
        //require that the author is valid
        require (authorAccts[_authid]==_authaddr);
    	papersCount++;
    	papers[papersCount] = Paper(papersCount, _authid, _url, 0, _noreferencedauth);
    }
    function addreferenced (uint256 _paperid, address[] memory _addr) public{
        for(uint256 i=0;i<papers[_paperid].noreferencedauthors;i++){
            referencedAuthors.push(_addr[i])-1;
        }
    }
    function _setupDecimals(uint8 decimals_) internal {
        _decimals = decimals_;
    }
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal { }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function submitReview (uint256 _reviewerid, address _revieweraddr, address  _authaddr, uint256 _a, uint256 _paperid, uint256 _amt) public {
       // require that they haven't reviewed before
         require(reviewerAccts[_reviewerid]==_revieweraddr);
        // require a valid author
        require(authors[_authaddr].authid==_a);
        //require that the paper belongs to the author
        require(papers[_paperid].authid == authors[_authaddr].authid);
        // record that reviwer has reviewed
        reviewers[_revieweraddr].reviewed = true;
        // update paper review Count
        papers[_paperid].reviewCount++;
        transferFrom(_authaddr,_revieweraddr,_amt);
    }

    //below function describes what to do in either cases, acception or rejection of the paper. transfer of eka tokens.
    function PaymentTransfers (address _authaddr, address _editaddr, uint256 _amt, uint256 _paperid) public {
        //deduct from author and send to editor
        if (_amt>=(minPaperAmount+papers[_paperid].noreferencedauthors)){
            _amt= (_amt-papers[_paperid].noreferencedauthors);
            transferFrom(_authaddr,_editaddr,_amt); 
        }
        _amt = _amt/papers[_paperid].noreferencedauthors;
        uint256 _b = papers[_paperid].noreferencedauthors;
        //send to referenced authors
        for(uint256 i=0;i<papers[_paperid].noreferencedauthors;i++){
            transferFrom(_authaddr,referencedAuthors[i],_b);
            _b--;
        } 
    }
    

    function acceptPaper (uint256 _authid, uint256 _paperid) public {
        //require that paperid is valid 
        require (_paperid >0 && _paperid<=papersCount);
        //require that paperid belongs to the correct author id
        require (papers[_paperid].authid == _authid);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }
    function _mint(address account, uint256 amount) internal{
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
}
