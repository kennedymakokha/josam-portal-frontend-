export function isInputsStringArray(inputs: unknown): inputs is string[] {
    return Array.isArray(inputs) && inputs.every(i => typeof i === 'string');
}

// function isInputsStringArray(inputs: unknown): inputs is string[] {
//     return (
//         Array.isArray(inputs) &&
//         inputs.length > 0 &&
//         typeof inputs[0] === 'string'
//     );
// }