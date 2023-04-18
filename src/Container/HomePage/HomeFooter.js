import FormatedText from '../../components/FormatedText/FormatedText';
import './HomeFooter.scss';

function HomeFooter() {
    return (
        <>
            <div className="footer-container ">
                <div className="footer-content container">
                    <div className="row">
                        <div className="col-md-4 col-6 col-sm-6 col-lg-3">
                            <h3><FormatedText id="footer.customerSupport" /></h3>
                            <a href="#!"><FormatedText id="footer.hotline" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.FrequentlyAskedQuestions" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SubmitSupportRequest" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.guide" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.Promotion" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SustomerSupportEmail" /></a>
                        </div>
                        <div className="col-md-4 col-6 col-sm-6 col-lg-3">
                            <h3><FormatedText id="footer.about" /></h3>
                            <a href="#!"><FormatedText id="footer.hotline" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.FrequentlyAskedQuestions" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SubmitSupportRequest" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.guide" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.Promotion" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SustomerSupportEmail" /></a>
                        </div>
                        <div className="col-md-4 col-6 col-sm-6 col-lg-3">
                            <h3><FormatedText id="footer.CooperationAssociation" /></h3>
                            <a href="#!"><FormatedText id="footer.hotline" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.FrequentlyAskedQuestions" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SubmitSupportRequest" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.guide" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.Promotion" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.SustomerSupportEmail" /></a>
                        </div>
                        <div className="col-md-4 col-6 col-sm-6 col-lg-3">
                            <h3><FormatedText id="footer.connectWithUs" /></h3>
                            <a href="#!"><FormatedText id="footer.hotline" /></a>
                            <br />
                            <a href="#!"><FormatedText id="footer.FrequentlyAskedQuestions" /></a>
                            <br />
                            <iframe
                                width="285"
                                height="185"
                                src="https://www.youtube.com/embed/7xL9c39DhjI"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                    <p className="text-center my-2">
                        <FormatedText id="footer.policy" />
                    </p>
                </div>
            </div>
        </>
    )
}

export default HomeFooter;
