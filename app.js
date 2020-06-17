function dropdown_data(){
    var select_dropdown = d3.select("#selDataset");
    d3.json ("samples.json").then((data)=>{
        var names = data.names;
        names.forEach((sample)=>{
            select_dropdown.append("option")
            .text(sample)
            .property("value", sample);
        });
        var first_sample = names[0];
        demographic_data(first_sample);
        create_chart(first_sample);
    });
}
dropdown_data()

function demographic_data(sampleID){
    d3.json ("samples.json").then((data)=>{
    var metadata = data.metadata;
    var info_array = metadata.filter(sample_object => sample_object.id == sampleID);
    var result = info_array[0];
    var display = d3.select("#sample-metadata");
    display.html("");
    Object.entries(result).forEach(([key, value])=>{
        display.append("h6").text(`${key};${value}`);
    });
    });
}

function optionChanged(sample){
    demographic_data(sample);
    create_chart(sample);
}

function create_chart(sampleID){
    d3.json ("samples.json").then((data)=>{
        var samples = data.samples;
        var info_array = samples.filter(sample_object => sample_object.id == sampleID);
        var result = info_array[0];
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;
        var bubble_data = [
            {
                x: otu_ids, 
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values, 
                    color: otu_ids, 
                    colorscale: "Earth"
                }
            }
        ];
        Plotly.newPlot("bubble", bubble_data);
        var data = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(), 
            type: "bar",
            orientation: "h",

        }];
        Plotly.newPlot("bar", data);

});
}

