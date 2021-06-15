import { strict as assert } from 'assert';

/** 要組合的對象 */
export interface Item {
	/** 種類，不得重複 */
	type: string;
	/** 數量，需為正整數 */
	amount: number;
}

/**
 * 列出所有組合
 * @param items 要撿的東西
 * @param pick 要挑幾個
 */
function combination<T extends Item = Item> (items: Array<T>, pick: number): Array<Array<T>> {
	/****
	 * The variable in this function：
	 *     result: The result of combinations through the recursive function "process"
	 *     selected: The temporary array for saving the combinations
	 */
	let result: Array<Array<T>> = new Array();
	let selected: Array<T> = new Array();

	result = process(items, pick, selected, 0);    //The recursive process for obtaining all combinations based on a specific "pick"
	
	//  Romove the duplicates in the result.
	//  Because "obj1 === obj2" only occurs when obj1 and obj2 have the same address, "indexOf" and "===" can not work as we need.
	//  I use "json string" for comparison of equality, and achieve the purpose of removing the duplicates in the result.
	result = result.filter((element,index)=>{
		let jsonstr = JSON.stringify(element);
		return index === result.findIndex(e =>{
			return jsonstr === JSON.stringify(e);
		});
	});
	return result;
}
/*****
 *  The parameter in this function:
 *      items: The items that can be selected.
 *      pick: The amount to be selected.
 *      selected: The temporary array for saving the combinations
 *      begin: The index record for "items".
 */
function process<T extends Item = Item> (items:Array<T>, pick:number, selected:Array<T>, begin:number): Array<Array<T>>{
	// The result will be returned in the format of Array<Array<T>>
	let result: Array<Array<T>> = new Array();

	// The terminal condition of recursion is that the number of "pick" equals 0. 
	if(pick == 0){
		result.push([...selected]);    //The [...selected] is the copy of "selected". 
	}
	else{
		for(let i:number = begin; i < items.length; i++){
			for(let j:number = 0; j <= items[i].amount; j++){
				if(j <= pick){
					// j > 0 is the purpose of avoid the appearance of {type=something, amount=0}.
					if(j > 0){
						selected.push(<T>({ type: items[i].type, amount: j }));    // Add the candidates.
					}
					/* For next recursive level, the pick decreases by j (the amount selected in this level), 
					   and the begin must be i+1 to avoid the dupliactes. 
					*/
				    process(items, pick - j, selected, i + 1).forEach(element=>result.push(element)); 
					if(j > 0){
						selected.splice(selected.length-1,1);
					}
				}
				else{
					break;  // if j > pick, the type can not be selected.
				}
			}
		}
	}
	return result;
}

let result = combination([
	{ type: 'Apple', amount: 2 },
	{ type: 'Banana', amount: 3 },
	{ type: 'Cat', amount: 2 },
	{ type: 'Dog', amount: 4 },
	{ type: 'Egg', amount: 1 },
], 12);
assert(result.length === 1);

result = combination([
	{ type: 'Apple', amount: 2 },
	{ type: 'Banana', amount: 3 },
	{ type: 'Cat', amount: 2 },
	{ type: 'Dog', amount: 4 },
	{ type: 'Egg', amount: 1 },
], 7);
result.forEach(ans => {
	const sum = ans.reduce((prev, curr) => {
		return prev + curr.amount;
	}, 0);
	assert(sum === 7);
});

result = combination([
	{ type: 'Apple', amount: 2 },
	{ type: 'Banana', amount: 3 },
	{ type: 'Cat', amount: 2 },
	{ type: 'Dog', amount: 4 },
	{ type: 'Egg', amount: 1 },
], 13);
assert(result.length === 0);

result = combination([
	{ type: 'Apple', amount: 1 },
	{ type: 'Banana', amount: 2 },
	{ type: 'Cat', amount: 3 },
], 2);
/** A1B1 A1C1 B1C1 B2 C2 */
assert(result.length === 5);
