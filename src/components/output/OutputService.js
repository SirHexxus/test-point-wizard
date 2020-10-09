//	Global Functions
//	Checks if 'num' is between 'a' and 'b' (inclusive of 'a' and 'b')
const inRange = (num, a, b) => Math.min(a, b) <= num && num <= Math.max(a, b);

//	Finds the HB44 Tolerances based on the Table 6 Tolerance Chart
const toleranceChart = (deviceClass, testpoint, gradSize) => {
	// console.log('deviceClass:', deviceClass, 'testpoint:', testpoint, 'gradSize:', gradSize)	//	DEBUGGING

	//	Number of grads for this testpoint
	const pointGrads = testpoint / gradSize;
	// console.log('pointGrads:', pointGrads)	//	DEBUGGING

	//	Calculates the number of decimal places in grad size
	const resolution = (toleranceGrads) =>
		0 < gradSize < 1
			? (toleranceGrads * gradSize).toFixed(
					parseInt(gradSize.toString().split('.')[1].length)
			  )
			: toleranceGrads * gradSize;
	// console.log('Resolution:', resolution(gradSize))	//	DEBUGGING

	//	Switches based on the value of 'deviceClass', and returns the allowed tolerance based on the number of grads in the testpoint
	switch (deviceClass) {
		case 'III-L':
			return inRange(pointGrads, 0, 500)
				? resolution(1)
				: inRange(pointGrads, 501, 1000)
				? resolution(2)
				: resolution(Math.ceil(pointGrads / 500));
		case 'IIII':
			return inRange(pointGrads, 0, 50)
				? resolution(1)
				: inRange(pointGrads, 51, 200)
				? resolution(2)
				: inRange(pointGrads, 201, 400)
				? resolution(3)
				: resolution(5);
		case 'III':
			return inRange(pointGrads, 0, 500)
				? resolution(1)
				: inRange(pointGrads, 501, 2000)
				? resolution(2)
				: inRange(pointGrads, 2001, 4000)
				? resolution(3)
				: resolution(5);
		case 'II':
			return inRange(pointGrads, 0, 5000)
				? resolution(1)
				: inRange(pointGrads, 5001, 20000)
				? resolution(2)
				: resolution(3);
		case 'I':
			return inRange(pointGrads, 0, 50000)
				? resolution(1)
				: inRange(pointGrads, 50001, 200000)
				? resolution(2)
				: resolution(3);
		default:
			return null;
	}
};

//	Generates test points as an array
const generateTestPoints = (
	gradSize,
	buildIncrement,
	spanPoints,
	cornerTest,
	sectionSpan,
	sections,
	deviceClass,
	capacity
) => {
	const testPointArray = [];
	//	Calculates each test point based on the build increment and number of span points
	for (let i = 1; i <= spanPoints; i++) {
		const testpoint = buildIncrement * i;
		//	if the testpoint value becomes higher than the capacity of the device, push the capacity as the testpoint, and break out of the loop
		if (testpoint > capacity) {
			testPointArray.push({
				order: i,
				testpoint: capacity,
				tolerance: toleranceChart(deviceClass, capacity, gradSize),
			});
			break;
		}
		//	push the testpoint to the array as an object, and calculate the tolerance using the 'toleranceChart' function
		testPointArray.push({
			order: i,
			testpoint,
			tolerance: toleranceChart(deviceClass, testpoint, gradSize),
		});
	}

	//	if the cornerTest boolean value is true, create corner tolerances at 1/4 of capacity
	if (cornerTest) {
		for (let i = 1; i <= 4; i++) {
			testPointArray.push({
				order: `corner ${i}`,
				testpoint: capacity / 4,
				tolerance: toleranceChart(deviceClass, capacity / 4, gradSize),
			});
		}
	}

	//	if the sectionTest boolean value is true, create section tolerances
	if (sectionSpan) {
		for (let i = 1; i <= sections; i++) {
			testPointArray.push({
				order: `section ${i}`,
				testpoint: sectionSpan,
				tolerance: toleranceChart(deviceClass, sectionSpan, gradSize),
			});
		}
	}

	return testPointArray;
};

module.exports = { generateTestPoints };
