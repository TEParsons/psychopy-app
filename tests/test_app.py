import pytest

# @pytest.fixture
# def app():
#     import psychopy_app
#     print("loading app for testing...")
#     from psychopy_app._psychopyApp import PsychoPyApp
#     app_instance = PsychoPyApp(
#         showSplash=False, 
#         testMode=True, 
#         safeMode=False, 
#         startView=None,
#         startFiles=None,
#         firstRun=False,
#         profiling=False,
#     )
#     yield app_instance  # Provide the app instance to the test
#     # Teardown: Clean up app after the tests
#     print("\nTearing down app...")
#     app_instance.quit()

# # Test cases
# def test_builder(app):
#     print("Testing showBuilder()...")
#     app.showBuilder()

# def test_runner(app):
#     print("Testing showRunner()...")
#     app.showRunner()
    
def test_app_launch():
    import psychopy_app
    print("loading app for testing...")
    from psychopy_app._psychopyApp import PsychoPyApp
    app_instance = PsychoPyApp(
        showSplash=False, 
        testMode=True, 
        safeMode=False, 
        startView=None,
        startFiles=None,
        firstRun=False,
        profiling=False,
    )
    print("App launched successfully!")
    app_instance.showBuilder()
    app_instance.showRunner()
    app_instance.showCoder()
    app_instance.quit()