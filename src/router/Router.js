import {Suspense, useContext, lazy, useEffect, useState} from 'react'
import { useLayout } from '@hooks/useLayout'
import { AbilityContext } from '@src/utility/context/Can'
import { useRouterTransition } from '@hooks/useRouterTransition'
import Spinner from '@components/spinner/Loading-spinner'
import LayoutWrapper from '@layouts/components/layout-wrapper'
import {BrowserRouter as AppRouter, Route, Switch, Redirect} from 'react-router-dom'
import { DefaultRoute, Routes } from './routes'
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";

const Router = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const authState = useSelector(state => state.auth);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const _unsubscribe_check_auth = () => {
      // TODO: refresh token system
      if (authState.isLoggedIn === true) {
        setIsUserLoggedIn(true);
      } else {
        const userJSON = `{"name":"${localStorage.getItem("currentUser")}"}`;
        const user=JSON.parse(userJSON);
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (user && accessToken && refreshToken) {
          dispatch({
            type: 'LOGIN',
            payload: {
              user,
              accessToken,
              refreshToken,
              id: user.uid,
            }
          });
        } else {
          setIsUserLoggedIn(false);
          dispatch({
            type: 'LOGOUT'
          });
        }
      }
    };
    _unsubscribe_check_auth();
  }, [authState.isLoggedIn]);

  

  const [layout, setLayout] = useLayout()
  const [transition, setTransition] = useRouterTransition()
  const ability = useContext(AbilityContext)
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }
  const currentActiveItem = null

  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []

    if (Routes) {
      Routes.filter(route => {
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }

    return { LayoutRoutes, LayoutPaths }
  }

  const NotAuthorized = lazy(() => import('@src/views/NotAuthorized'))

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/Error'))

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = props => {
    const route = props.route
    let action, resource

    // ** Assign vars based on route meta
    if (route.meta) {
      action = route.meta.action ? route.meta.action : null
      resource = route.meta.resource ? route.meta.resource : null
    }

    if (
      (!isUserLoggedIn && route.meta === undefined) ||
      (!isUserLoggedIn && route.meta && !route.meta.authRoute && !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
       */

      return <Redirect to='/login' />
    } /*else if (route.meta && route.meta.authRoute && isUserLoggedIn) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      return <Redirect to='/' />
    } else if (isUserLoggedIn) { // !ability.can(action || 'read', resource)
      // ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
      return <Redirect to='/misc/not-authorized' />
    } */else {
      // ** If none of the above render component
      return <route.component {...props} />
    }
  }

  // ** Return Route to Render
  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout]

      // ** Get Routes and Paths of the Layout
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout)

      // ** We have freedom to display different layout for different route
      // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
      // ** that we want to implement like VerticalLayout or HorizontalLayout
      // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

      // ** RouterProps to pass them to Layouts
      const routerProps = {}

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            routerProps={routerProps}
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map(route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta
                      })

                      return (
                        <Suspense fallback={<Spinner />}>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                          <LayoutWrapper
                            layout={DefaultLayout}
                            transition={transition}
                            setTransition={setTransition}
                            /* Conditional props */
                            /*eslint-disable */
                            {...(route.appLayout
                              ? {
                                  appLayout: route.appLayout
                                }
                              : {})}
                            {...(route.meta
                              ? {
                                  routeMeta: route.meta
                                }
                              : {})}
                            {...(route.className
                              ? {
                                  wrapperClass: route.className
                                }
                              : {})}
                            /*eslint-enable */
                          >
                            {/* <route.component {...props} /> */}
                            <FinalRoute route={route} {...props} />
                          </LayoutWrapper>
                        </Suspense>
                      )
                    }}
                  />
                )
              })}
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  return isUserLoggedIn === null ? <Spinner /> : (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path='/'
          render={() => {
            return authState.isLoggedIn === isUserLoggedIn && isUserLoggedIn
              ? <Redirect to={DefaultRoute} />
              : <Redirect to='/login' />
          }}
        />
        {/*
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to={DefaultRoute} />
          }}
        />
        */}
        {/* Not Auth Route */}
        <Route
          exact
          path='/not-authorized'
          render={props => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}
        {/* NotFound Error page */}
        <Route path='*' component={Error} />
      </Switch>
    </AppRouter>
  )
}

export default Router
