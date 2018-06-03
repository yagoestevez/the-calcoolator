import React, { Component } from 'react';
import Display              from './Display';
import Pads                 from './Pads';
import Brand                from './Brand';

class Calculator extends Component {

  constructor( props ) {
    super( props );
    this.actions = [
      'clear', '↶', '❀', 'menu',
      '7', '8', '9', '÷',
      '4', '5', '6', '×',
      '1', '2', '3', '-',
      '.', '0', '=', '+'
    ];
    this.state = {
      expression  : 'do your math',
      result      : '0',
      showMenu    : false,
      loadTheme   : ''
    };
    this.PLACEHOLDER = 'do your math';
    this.ERROR       = 'Bad Expression!';
    this.themes       = {
      list: ['', 'Yellow.css', 'Blue.css', 'Green.css', 'Light.css'],
      curr: 0
    };
  }

  clearDisplay = ( ) => {
    this.setState({
      expression: '0',
      result: '0'
    });
  }

  unDo = ( currExpr ) => {
    if ( currExpr === String(this.state.result) ) return currExpr;
    return currExpr.length > 1 && currExpr !== this.PLACEHOLDER
          ? currExpr.substr(0, currExpr.length - 1)
          : this.PLACEHOLDER;
  }

  changeTheme = () => {
    const list = this.themes.list;
    const index = this.themes.curr === list.length-1 ? 0 : this.themes.curr+1;
    this.themes.curr = index;
    this.setState( { loadTheme: `${list[ index ]}` } );
  }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  };

  addDigit = ( currExpr, pad ) => {
    return currExpr === '0' || currExpr === this.PLACEHOLDER || currExpr === this.ERROR
          ? pad
          : currExpr + pad;
  }

  addDecimal = ( currExpr, pad ) => {
    // console.log( (currExpr+pad).match( /(\D\s)?\d+\./g ) );
    if ( (currExpr+pad).match( /(\D\s)?\d+\.\d*\./g ) )
      return currExpr;
    else
      return currExpr + pad;
    // if ( (currExpr+pad).substr( currExpr.length ) === '.' )
    //   return currExpr + pad;

    // EVITAR:  1.1.1 + 1..1

    // if ( currExpr.indexOf( '.' ) !== -1 )
    //   if ( (currExpr+pad).match( /\D\s\d+\./g ) )
    //     return currExpr + pad;
    //   else
    //     return currExpr;
    // else
    //   return currExpr + pad;

    // if ( currExpr.indexOf( '.' ) !== -1 ) {
    //   if ( (currExpr+pad).match( /\.\d.\D.\d+/g ) ) {
    //     console.log( 'hay punto y casi otro' );
    //     return currExpr+pad;
    //   }
    //   console.log( 'hay punto' );
    //   return currExpr;
    // }
    // console.log( (currExpr+pad).match( /\.\d.\D.\d+\./g ) );
  }

  addOperator = ( currExpr, pad ) => {
    const endsWithNaN = isNaN( currExpr.substr( currExpr.length - 1 ) );
    const andsWithaSpace  = currExpr.substr( currExpr.length - 1 ) === ' ';
    if ( andsWithaSpace )
      return currExpr.substr( 0, currExpr.length - 2 ) + ' ' + pad + ' ';
    else if (  endsWithNaN )
      return currExpr;
    else
      return currExpr + ' ' + pad + ' ';
  }

  doMath = ( currExpr ) => {
    // TODO: Convert resulting large decimal numbers into exponents.
    let result      = this.state.result;
    let updateExpr  = this.state.expression;
    currExpr = this.formatExpression( currExpr );
    if ( isNaN( currExpr[currExpr.length-1] ) ) {
      this.setState({
        result: 'ERROR', expression: this.ERROR
      }, () => setTimeout( () => {
        this.setState({
          result: result,
          expression: updateExpr
        })
      }, 800 ));
      return;
    } else {
      result = updateExpr = currExpr !== '' ? new Function(`return ${currExpr}`)() : '';
    }
    this.setState({
      result: result,
      expression: updateExpr
    });
  };

  formatExpression = ( currExpr ) => {
    return currExpr.replace(/ /g,'').replace( /×/g, '*' ).replace( /÷/g, '/' );
  }

  updateExpression = pad => {
    const currExpr = String( this.state.expression );
    let updateExpr = '';
    let updateRslt = this.state.result;
    if      ( pad === 'clear' ) return this.clearDisplay( );
    else if ( pad === '↶'     ) updateExpr = this.unDo( currExpr );
    else if ( pad === '❀'     ) return this.changeTheme();
    else if ( pad === 'menu'  ) return this.toggleMenu( );
    else if ( !isNaN( pad )   ) updateExpr = this.addDigit( currExpr, pad );
    else if ( pad === '.'     ) updateExpr = this.addDecimal( currExpr, pad );
    else if ( pad === '+'
           || pad === '-'
           || pad === '×'
           || pad === '÷'     ) updateExpr = this.addOperator( currExpr, pad );
    else if ( pad === '='     ) return this.doMath( currExpr );
    this.setState({
      expression: updateExpr,
      result: updateRslt
    });
  };

  loadTheme ( ) {
    return this.state.loadTheme !== ''
      ? <link rel="stylesheet" type="text/css"
            href={'Themes/' + this.state.loadTheme} />
      : null;
  }

  render() {
    return (
      <React.Fragment>
        { this.loadTheme() }
        <Display expr={this.state.expression} result={this.state.result} />
        <Brand />
        <Pads
          actions={this.actions}
          updateExpr={this.updateExpression}
          toggleMenu={this.toggleMenu}
          showMenu={this.state.showMenu}
        />
      </React.Fragment>
    );
  }
}

export default Calculator;
