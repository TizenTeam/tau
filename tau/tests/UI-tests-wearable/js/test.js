
describe('ImageTest', function() {


    // Matchers
    beforeEach(function () {
        this.addMatchers(imagediff.jasmine);
    });

    it('should be the same image', function () {
    async.forEachSeries(window.tests, function(testName, callback) {
        // Test

            var a = new Image(),
                b = new Image();
            a.src = 'images/' + testName.name + '.png';
            b.src = 'result/' + testName.name + '.png';


            waitsFor(function () {
                return a.complete & b.complete;
            }, 'image not loaded.', 200);

            runs(function () {
                expect(b).toImageDiffEqual(a);
                callback();
            });
        });
    });

});
